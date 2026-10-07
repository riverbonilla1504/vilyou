import { dialogos } from "@/content/dialogos";
import { achieve } from "./songs";
import { say } from "./speech";
import { createStore } from "./store";

/** The 7 ground flowers: tulips and lilies, as on the first screen. */
export const FLOWERS: { sprite: "tulip" | "lily"; palette?: Record<string, string>; lift: number }[] = [
  { sprite: "tulip", lift: 0 },
  { sprite: "lily", lift: 10 },
  { sprite: "tulip", palette: { R: "#ffd54f", L: "#fff1a8", D: "#e0a92a" }, lift: 4 },
  { sprite: "tulip", palette: { R: "#c58cff", L: "#ead4ff", D: "#9a5ee0" }, lift: 14 },
  { sprite: "lily", palette: { W: "#ffe3ef", L: "#ff9ec7", P: "#ff5d8f" }, lift: 4 },
  { sprite: "tulip", palette: { R: "#ffd54f", L: "#fff1a8", D: "#e0a92a" }, lift: 10 },
  { sprite: "tulip", lift: 0 },
];

/** Which of the 7 flowers she has touched on this visit. */
export const litFlowersStore = createStore<number[]>([]);

/** True while the giant tulip is on screen. */
export const giantTulipStore = createStore(false);

/** River speaks once per kind of flower and visit, so she can keep tapping. */
const spoke = new Set<string>();

/** A flower was tapped. When all 7 have been touched, the giant tulip grows. */
export function tapFlower(i: number) {
  const lit = litFlowersStore.get();
  const next = lit.includes(i) ? lit : [...lit, i];
  if (next.length === FLOWERS.length) {
    litFlowersStore.set([]);
    giantTulipStore.set(true);
    achieve("tulipan");
    return;
  }
  litFlowersStore.set(next);
  const kind = FLOWERS[i].sprite;
  if (!spoke.has(kind)) {
    spoke.add(kind);
    say(kind === "lily" ? dialogos.lirio : dialogos.tulipan);
  }
}
