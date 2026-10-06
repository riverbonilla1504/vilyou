import { createPersistentStore } from "./store";

/** Retro chiptune blips made with WebAudio, so there are no audio files. */

export const soundStore = createPersistentStore<boolean>("vilyou:sound", true);

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined" || !soundStore.get()) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  { at = 0, length = 0.08, type = "square" as OscillatorType, volume = 0.04 } = {},
) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + length + 0.02);
}

/** One letter of dialogue. */
export function blip() {
  tone(440 + Math.random() * 120, { length: 0.045, volume: 0.022 });
}

/** Paper unfolding / envelope opening. */
export function swoosh() {
  [330, 392, 494].forEach((f, i) => tone(f, { at: i * 0.05, length: 0.09, type: "triangle", volume: 0.05 }));
}

/** Item found. */
export function chime() {
  [523, 659, 784, 1047].forEach((f, i) =>
    tone(f, { at: i * 0.075, length: 0.18, type: "triangle", volume: 0.06 }),
  );
}

/** Small UI click. */
export function pop() {
  tone(660, { length: 0.05, type: "square", volume: 0.03 });
  tone(990, { at: 0.03, length: 0.05, type: "square", volume: 0.02 });
}

/** Grand finale. */
export function fanfare() {
  [523, 659, 784, 659, 784, 1047].forEach((f, i) =>
    tone(f, { at: i * 0.11, length: 0.22, type: "square", volume: 0.035 }),
  );
}

/** A new discovery. */
export function sparkleSound() {
  [880, 1175, 1568].forEach((f, i) => tone(f, { at: i * 0.06, length: 0.14, type: "triangle", volume: 0.045 }));
}

/** Wrong code. */
export function buzz() {
  tone(180, { length: 0.16, type: "square", volume: 0.035 });
  tone(140, { at: 0.12, length: 0.2, type: "square", volume: 0.035 });
}

/** Padlock opening. */
export function unlockSound() {
  tone(392, { length: 0.08, type: "square", volume: 0.04 });
  tone(523, { at: 0.08, length: 0.08, type: "square", volume: 0.04 });
  [659, 784, 1047, 1319].forEach((f, i) =>
    tone(f, { at: 0.22 + i * 0.07, length: 0.2, type: "triangle", volume: 0.05 }),
  );
}

/** A little synthesized "miau". */
export function meow() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.linearRampToValueAtTime(820, t + 0.12);
  osc.frequency.linearRampToValueAtTime(460, t + 0.42);
  lfo.frequency.value = 9;
  lfoGain.gain.value = 18;
  lfo.connect(lfoGain).connect(osc.frequency);
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1600;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.05, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  osc.connect(filter).connect(gain).connect(c.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + 0.5);
  lfo.stop(t + 0.5);
}

/** Purring: a low rumble with a slow wobble. */
export function purr() {
  for (let i = 0; i < 6; i++) tone(55 + (i % 2) * 6, { at: i * 0.18, length: 0.16, type: "sawtooth", volume: 0.03 });
}

/** Blowing out a candle. */
export function blowSound() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const buffer = c.createBuffer(1, c.sampleRate * 0.3, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  const gain = c.createGain();
  gain.gain.value = 0.08;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(t);
}

/** A goat's "beeeh". */
export function bleat() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(380, t);
  osc.frequency.linearRampToValueAtTime(340, t + 0.5);
  lfo.frequency.value = 22;
  lfoGain.gain.value = 30;
  lfo.connect(lfoGain).connect(osc.frequency);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.03, t + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + 0.6);
  lfo.stop(t + 0.6);
}

/** A record scratch, for skipping songs. */
export function scratch() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const buffer = c.createBuffer(1, c.sampleRate * 0.28, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 6;
  filter.frequency.setValueAtTime(500, t);
  filter.frequency.exponentialRampToValueAtTime(2600, t + 0.12);
  filter.frequency.exponentialRampToValueAtTime(700, t + 0.26);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.27);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(t);
}
