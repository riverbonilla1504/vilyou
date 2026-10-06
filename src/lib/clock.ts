import { useSyncExternalStore } from "react";

let now = 0;
let timer: number | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    now = Date.now();
    timer = window.setInterval(() => {
      now = Date.now();
      for (const l of listeners) l();
    }, 250);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.clearInterval(timer);
  };
}

function getSnapshot() {
  if (!now) now = Date.now();
  return now;
}

/** Current time, ticking 4× per second. Always 0 on the server and during hydration. */
export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}

/** Splits a duration into days, hours, minutes and seconds. */
export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  };
}

export const pad = (n: number) => String(n).padStart(2, "0");

/**
 * True once `ts` has passed. Only re-renders when the answer flips, so whole
 * screens don't re-render every tick. `null` on the server and during hydration.
 */
export function useIsPast(ts: number) {
  return useSyncExternalStore(
    subscribe,
    () => Date.now() >= ts,
    () => null,
  );
}
