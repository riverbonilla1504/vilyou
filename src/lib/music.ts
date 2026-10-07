import { dedicada, type Cancion } from "@/content/musica";
import { discoStore, musicStore } from "./music-state";
import { unlockedSongs } from "./songs";
import { soundStore } from "./sound";

export { discoStore, musicStore, swipedStore, turntableStore, type MusicState } from "./music-state";

/**
 * The record player behind the moon.
 *
 * The first tap on the moon plays the dedicated song; when it ends (and on
 * every later visit) the songs she has collected play shuffled, forever.
 * Volume goes through a WebAudio gain node because iOS ignores `audio.volume`,
 * and that is the only way to fade in and out smoothly on her iPhone.
 */

const VOLUME = 0.85;
const FADE_IN = 1.6;
const FADE_OUT = 0.9;
const FADE_SKIP = 0.35;

let el: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let queue: Cancion[] = [];
const history: Cancion[] = [];
let pauseTimer: number | undefined;
let skipTimer: number | undefined;
let snippetTimer: number | undefined;
let primed = false;
let waitingForTap = false;
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

/** Next song from the shuffled bag of songs she has. */
function nextSong(): Cancion {
  const have = unlockedSongs();
  const last = musicStore.get().track;
  if (!have.length) return dedicada;
  queue = queue.filter((c) => have.some((h) => h.id === c.id));
  if (!queue.length) {
    queue = shuffled(have);
    // Never repeat the song that just ended when the bag refills.
    if (queue.length > 1 && last && queue[0].id === last.id) queue.push(queue.shift()!);
  }
  return queue.shift()!;
}

/** A song she just unlocked plays right after the current one. */
export function queueNext(song: Cancion) {
  queue = [song, ...queue.filter((c) => c.id !== song.id)];
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

  el.addEventListener("ended", () => load(nextSong(), true));
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
  try {
    navigator.mediaSession.metadata = new MediaMetadata({ title: track.titulo, artist: track.artista, album: "VILyou" });
    navigator.mediaSession.setActionHandler("play", () => resume());
    navigator.mediaSession.setActionHandler("pause", () => pause());
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
    navigator.mediaSession.setActionHandler("previoustrack", () => previous());
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
  if (!soundStore.get()) return;

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

function load(track: Cancion, autoplay: boolean, remember = true) {
  const a = setup();
  if (!a) return;
  window.clearTimeout(skipTimer);
  window.clearTimeout(snippetTimer);
  const prev = musicStore.get().track;
  if (remember && prev && prev.id !== track.id) history.push(prev);
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

/** Switches songs with a quick fade, so skipping never clicks. */
function switchTo(track: Cancion, remember = true) {
  musicStore.set((s) => ({ ...s, playing: true }));
  const a = setup();
  if (!a) return;
  if (a.paused || !musicStore.get().audible) {
    load(track, true, remember);
    return;
  }
  // Keep the tap's permission alive on iOS: the actual play() happens in load(),
  // so only fade here when audio is already flowing.
  fadeTo(0, FADE_SKIP);
  window.clearTimeout(skipTimer);
  skipTimer = window.setTimeout(() => load(track, true, remember), FADE_SKIP * 1000);
}

/** First tap on the moon: the moon becomes a record and the song starts. */
export function playDedicated() {
  discoStore.set(true);
  musicStore.set((s) => ({ ...s, playing: true }));
  load(dedicada, true);
}

/** On every visit after the dedication: her songs, shuffled, from the start. */
export function startPlaylist() {
  if (musicStore.get().track) return;
  musicStore.set((s) => ({ ...s, playing: true }));
  load(nextSong(), true);
}

/**
 * Call inside any tap while she waits: lets the browser play sound later
 * without a tap (iOS only allows that once an element has played from a tap).
 */
export function primeAudio() {
  if (primed || musicStore.get().track) return;
  const a = setup();
  if (!a) return;
  primed = true;
  if (ctx && ctx.state !== "running") void ctx.resume().catch(() => {});
  if (gain) gain.gain.value = 0;
  else a.volume = 0;
  a.src = dedicada.src;
  a.play()
    .then(() => {
      if (!musicStore.get().playing) {
        quietPausing = true;
        a.pause();
      }
    })
    .catch(() => {
      primed = false;
    });
}

/** A few seconds of a song with a soft fade (for the end of the countdown). */
export function playSnippet(song: Cancion, from: number, seconds: number) {
  if (musicStore.get().playing || !soundStore.get()) return;
  const a = setup();
  if (!a) return;
  window.clearTimeout(snippetTimer);
  if (gain) gain.gain.value = 0;
  else a.volume = 0;
  a.src = `${song.src}#t=${from}`;
  if (ctx && ctx.state !== "running") void ctx.resume().catch(() => {});
  a.play()
    .then(() => {
      fadeTo(VOLUME, 1.2);
      snippetTimer = window.setTimeout(() => {
        if (musicStore.get().playing) return;
        fadeTo(0, 2.5);
        snippetTimer = window.setTimeout(() => {
          if (musicStore.get().playing || a.paused) return;
          quietPausing = true;
          a.pause();
          musicStore.set((s) => ({ ...s, audible: false }));
        }, 2600);
      }, Math.max(1, seconds - 2.5) * 1000);
    })
    .catch(() => {
      // Blocked (she never tapped): the moment still happens, just silent.
    });
}

/** Plays one song now (from the turntable or a record she tapped). */
export function playSong(song: Cancion) {
  const m = musicStore.get();
  if (m.track?.id === song.id) {
    if (!m.playing || !m.audible) resume();
    return;
  }
  switchTo(song);
}

export function next() {
  switchTo(nextSong());
}

/** Back to the start of the song, or to the previous one if it just began. */
export function previous() {
  const a = setup();
  if (!a) return;
  if (a.currentTime > 4 || !history.length) {
    a.currentTime = 0;
    if (!musicStore.get().playing) resume();
    return;
  }
  const prev = history.pop()!;
  const current = musicStore.get().track;
  if (current) queue.unshift(current);
  // The song we leave goes back to the front of the queue, not to the history.
  switchTo(prev, false);
}

export function pause() {
  if (!setup()) return;
  musicStore.set((s) => ({ ...s, playing: false, audible: false }));
  fadeOutAndStop();
}

export function resume() {
  musicStore.set((s) => ({ ...s, playing: true }));
  if (!musicStore.get().track) load(nextSong(), true);
  else start();
}

export function toggle() {
  if (musicStore.get().playing && musicStore.get().audible) pause();
  else resume();
}

/** Where the song is, for the turntable's progress bar. */
export function progress() {
  if (!el || !el.duration || !isFinite(el.duration)) return { current: 0, duration: 0 };
  return { current: el.currentTime, duration: el.duration };
}

export function seek(fraction: number) {
  if (!el || !el.duration || !isFinite(el.duration)) return;
  el.currentTime = Math.max(0, Math.min(0.999, fraction)) * el.duration;
}

/** Fades the music out while something else plays (her voice note); returns the undo. */
export function hold() {
  const wasPlaying = musicStore.get().playing && !!el && !el.paused;
  if (wasPlaying) fadeOutAndStop();
  return () => {
    if (wasPlaying && musicStore.get().playing) start();
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
  (window as unknown as { __music?: unknown }).__music = { store: musicStore, audio: () => el, ctx: () => ctx, next };
}
