import { dedicada, playlist, type Cancion } from "@/content/musica";
import { soundStore } from "./sound";
import { createPersistentStore, createStore } from "./store";

/**
 * The record player behind the moon.
 *
 * The first tap on the moon plays the dedicated song; when it ends (and on
 * every later visit) the playlist plays shuffled, forever. Volume goes through
 * a WebAudio gain node because iOS ignores `audio.volume`, and that is the only
 * way to fade in and out smoothly on her iPhone.
 */

/** Once true, the moon is a record for good. */
export const discoStore = createPersistentStore<boolean>("vilyou:disco", false);

export type MusicState = {
  /** Wants to be playing (false while paused by her). */
  playing: boolean;
  /** Sound is actually coming out (false while waiting for the first tap). */
  audible: boolean;
  track: Cancion | null;
};

export const musicStore = createStore<MusicState>({ playing: false, audible: false, track: null });

const VOLUME = 0.85;
const FADE_IN = 1.6;
const FADE_OUT = 0.9;

let el: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let queue: Cancion[] = [];
let pauseTimer: number | undefined;
let waitingForTap = false;
/** Paused because something else (the Spotify place) needs the stage. */
let held = 0;
/** The next "pause" event is ours (end of a fade), not hers. */
let quietPausing = false;

function shuffled<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nextFromPlaylist(): Cancion {
  if (!queue.length) {
    const last = musicStore.get().track;
    queue = shuffled(playlist);
    // Never repeat the song that just ended when the bag refills.
    if (queue.length > 1 && last && queue[0].src === last.src) queue.push(queue.shift()!);
  }
  return queue.shift()!;
}

function setup() {
  if (el || typeof window === "undefined") return el;
  el = new Audio();
  el.preload = "auto";
  el.setAttribute("playsinline", "");

  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (AC) {
    try {
      ctx = new AC();
      gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination);
    } catch {
      ctx = null;
      gain = null;
    }
  }
  // Let the music play even with the iPhone's silent switch on (Safari 16.4+).
  const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
  if (session) {
    try {
      session.type = "playback";
    } catch {
      // Not supported: the silent switch wins.
    }
  }

  el.addEventListener("ended", () => load(nextFromPlaylist(), true));
  el.addEventListener("playing", () => musicStore.set((s) => ({ ...s, audible: true })));
  // Paused from outside (lock screen, Control Center, a phone call).
  el.addEventListener("pause", () => {
    if (quietPausing) {
      quietPausing = false;
      return;
    }
    if (!el!.ended && musicStore.get().playing) {
      musicStore.set((s) => ({ ...s, playing: false, audible: false }));
    }
  });
  return el;
}

function fadeTo(target: number, seconds: number) {
  if (gain && ctx) {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(target, now + seconds);
  } else if (el) {
    // Desktop fallback without WebAudio.
    const from = el.volume;
    const start = performance.now();
    const step = () => {
      if (!el) return;
      const t = Math.min(1, (performance.now() - start) / (seconds * 1000));
      el.volume = from + (target - from) * t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

function mediaSession(track: Cancion) {
  if (!("mediaSession" in navigator)) return;
  const cut = track.titulo.indexOf(" - ");
  const artist = cut > 0 ? track.titulo.slice(0, cut) : "";
  const title = cut > 0 ? track.titulo.slice(cut + 3) : track.titulo;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({ title, artist, album: "VILyou" });
    navigator.mediaSession.setActionHandler("play", () => resume());
    navigator.mediaSession.setActionHandler("pause", () => pause());
    navigator.mediaSession.setActionHandler("nexttrack", () => load(nextFromPlaylist(), true));
  } catch {
    // Older browsers.
  }
}

/** Fades out, then really pauses (keeps her "playing" wish untouched). */
function fadeOutAndStop() {
  fadeTo(0, FADE_OUT);
  window.clearTimeout(pauseTimer);
  pauseTimer = window.setTimeout(() => {
    pauseTimer = undefined;
    if (el && !el.paused) {
      quietPausing = true;
      el.pause();
    }
  }, FADE_OUT * 1000 + 60);
}

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Starts playback, or waits for her first tap if the browser blocks autoplay. */
function start() {
  const a = setup();
  if (!a) return;
  window.clearTimeout(pauseTimer);
  pauseTimer = undefined;
  if (!soundStore.get() || held > 0) return;

  // Both calls must happen right here, inside the tap, for iOS to allow them.
  const resumed = ctx && ctx.state !== "running" ? ctx.resume().catch(() => {}) : Promise.resolve();
  const played = a.play();
  Promise.all([played, Promise.race([resumed, wait(500)])])
    .then(() => {
      if (ctx && ctx.state !== "running") waitForTap();
      else fadeTo(VOLUME, FADE_IN);
    })
    .catch(() => waitForTap());
}

const unlockEvents = ["pointerup", "touchend", "click", "keydown"] as const;

function waitForTap() {
  if (waitingForTap) return;
  waitingForTap = true;
  const go = () => {
    unlockEvents.forEach((e) => window.removeEventListener(e, go, true));
    waitingForTap = false;
    if (musicStore.get().playing) start();
  };
  unlockEvents.forEach((e) => window.addEventListener(e, go, true));
}

/** True while the music wants to play but the browser is still waiting for a tap. */
export function isWaitingForTap() {
  return waitingForTap;
}

function load(track: Cancion, autoplay: boolean) {
  const a = setup();
  if (!a) return;
  a.src = track.src;
  // Keep "audible" across track changes so the record does not stutter between songs.
  musicStore.set((s) => ({ ...s, track, audible: s.track ? s.audible : false }));
  mediaSession(track);
  if (autoplay && musicStore.get().playing) {
    if (gain) gain.gain.value = 0;
    else a.volume = 0;
    start();
  }
}

/** First tap on the moon: the moon becomes a record and the song starts. */
export function playDedicated() {
  discoStore.set(true);
  musicStore.set((s) => ({ ...s, playing: true }));
  load(dedicada, true);
}

/** On every visit after the dedication: the shuffled playlist, from the start. */
export function startPlaylist() {
  if (musicStore.get().track) return;
  musicStore.set((s) => ({ ...s, playing: true }));
  load(nextFromPlaylist(), true);
}

export function pause() {
  if (!setup()) return;
  musicStore.set((s) => ({ ...s, playing: false, audible: false }));
  fadeOutAndStop();
}

export function resume() {
  musicStore.set((s) => ({ ...s, playing: true }));
  if (!musicStore.get().track) load(nextFromPlaylist(), true);
  else start();
}

export function toggle() {
  if (musicStore.get().playing) pause();
  else resume();
}

/** Fades the music out while something else plays (e.g. Spotify); returns the undo. */
export function hold() {
  held++;
  if (el && musicStore.get().playing) fadeOutAndStop();
  return () => {
    held = Math.max(0, held - 1);
    if (held === 0 && musicStore.get().playing) start();
  };
}

// The speaker button in the HUD mutes the music too.
if (typeof window !== "undefined") {
  soundStore.subscribe(() => {
    if (!el || !musicStore.get().playing) return;
    if (soundStore.get()) start();
    else fadeOutAndStop();
  });
}

// Dev-only handle for testing from the console.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __music?: unknown }).__music = { store: musicStore, audio: () => el, ctx: () => ctx };
}
