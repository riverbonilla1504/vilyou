import { createPersistentStore, createStore } from "./store";

export type MochilaView = "menu" | "cartas" | "cupones" | "fotos" | "mapa" | "logro";

/** Which page of the backpack is open (null = closed). */
export const mochilaStore = createStore<MochilaView | null>(null);

/** She has opened the backpack at least once (hides the "new" badge). */
export const mochilaSeenStore = createPersistentStore<boolean>("vilyou:mochila-vista", false);

/** Coupons she has read (flipped) and redeemed, by index, with the date. */
export const cuponesStore = createPersistentStore<{ leidos: number[]; canjeados: Record<number, string> }>(
  "vilyou:cupones",
  { leidos: [], canjeados: {} },
);

/** Sealed letters she has opened, and the ones River already told her about. */
export const cartasStore = createPersistentStore<{ leidas: number[]; avisadas: number[] }>("vilyou:cartas", {
  leidas: [],
  avisadas: [],
});

/** Map pins she has visited. */
export const mapaStore = createPersistentStore<number[]>("vilyou:mapa", []);

/** She has already seen the final achievement pop up by itself. */
export const logroVistoStore = createPersistentStore<boolean>("vilyou:logro-visto", false);
