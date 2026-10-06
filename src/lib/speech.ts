import { dialogos } from "@/content/dialogos";
import { dedicada } from "@/content/musica";
import { musicStore, playDedicated } from "./music";
import { createStore } from "./store";

/** Who shows up in the portrait. */
export type Speaker = "river" | "nosotros";

export type Speech = {
  key: number;
  texto: string;
  quien: Speaker;
  /** Purple hearts float up while the dialogue is open. */
  corazones?: boolean;
};

/** The Stardew-style dialogue currently on screen. */
export const speechStore = createStore<Speech | null>(null);

let key = 0;

export function say(texto: string, opts: { quien?: Speaker; corazones?: boolean } = {}) {
  speechStore.set({ key: ++key, texto, quien: opts.quien ?? "river", corazones: opts.corazones });
}

export function hush() {
  speechStore.set(null);
}

/**
 * First tap on the moon: the song starts and, a moment after it is actually
 * audible, River shows up to dedicate it.
 */
export function dedicateSong() {
  playDedicated();
  let timer: number | undefined;
  const check = () => {
    const m = musicStore.get();
    if (timer === undefined && m.audible && m.track?.src === dedicada.src) {
      timer = window.setTimeout(() => {
        say(dialogos.dedicatoria, { quien: "nosotros", corazones: true });
      }, dialogos.esperaDedicatoria * 1000);
      unsubscribe();
    }
  };
  const unsubscribe = musicStore.subscribe(check);
  check();
}
