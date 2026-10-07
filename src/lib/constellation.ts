import { createPersistentStore, createStore } from "./store";

/** Once she draws it, the constellation stays lit forever. */
export const constellationDoneStore = createPersistentStore<boolean>("vilyou:constelacion", false);

/** The big night sky where she joins the stars. */
export const constellationSkyStore = createStore(false);

export type StarPoint = [number, number];

/** V, ♥ and R, star by star, in the order she has to tap them (x, y in % of the box). */
export const CONSTELLATION: { points: StarPoint[]; closed?: boolean }[] = [
  // V
  { points: [[0, 0], [9, 100], [18, 0]] },
  // ♥ (from the bottom tip, around, back to the tip)
  { points: [[46, 100], [33, 42], [36, 6], [46, 24], [56, 6], [59, 42]], closed: true },
  // R
  { points: [[72, 100], [72, 0], [88, 8], [90, 38], [72, 50], [92, 100]] },
];

/** Every pair of stars joined by a line once it's drawn. */
export function constellationLines() {
  const lines: [StarPoint, StarPoint][] = [];
  for (const s of CONSTELLATION) {
    for (let i = 1; i < s.points.length; i++) lines.push([s.points[i - 1], s.points[i]]);
    if (s.closed) lines.push([s.points[s.points.length - 1], s.points[0]]);
  }
  return lines;
}
