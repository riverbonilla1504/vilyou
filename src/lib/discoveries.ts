import { porId, TOTAL } from "@/content/descubrimientos";
import { sparkleSound } from "./sound";
import { createPersistentStore, createStore } from "./store";

/** Everything she has found, remembered between visits. */
export const discoveredStore = createPersistentStore<string[]>("vilyou:descubiertos", []);

/** Stardew-style "item received" notifications waiting to be shown. */
export const toastStore = createStore<{ id: string; key: number }[]>([]);

let toastKey = 0;

function pushToast(id: string) {
  toastStore.set((q) => [...q, { id, key: ++toastKey }]);
}

export function dismissToast(key: number) {
  toastStore.set((q) => q.filter((t) => t.key !== key));
}

export function isDiscovered(id: string) {
  return discoveredStore.get().includes(id);
}

/** Marks something as found. Returns true the first time only. */
export function discover(id: string) {
  if (!porId[id] || isDiscovered(id)) return false;
  let next = [...discoveredStore.get(), id];
  discoveredStore.set(next);
  pushToast(id);
  sparkleSound();

  if (next.length === TOTAL - 1 && !next.includes("todo")) {
    next = [...next, "todo"];
    discoveredStore.set(next);
    pushToast("todo");
  }
  return true;
}
