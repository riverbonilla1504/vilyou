import { useSyncExternalStore } from "react";

export type Momento = "manana" | "tarde" | "atardecer" | "noche";
export type Siete = "dia" | "hora" | "minuto" | null;

/** Morning, afternoon, sunset or night, by her phone's clock. */
export function momentoDelDia(d: Date): Momento {
  const h = d.getHours();
  if (h >= 6 && h < 12) return "manana";
  if (h >= 12 && h < 17) return "tarde";
  if (h >= 17 && h < 19) return "atardecer";
  return "noche";
}

/** Is there a 7 in the day, the hour (7 a. m., 5 p. m. = 17, 7 p. m.) or the minute? */
export function sieteEn(d: Date): Siete {
  if (String(d.getDate()).includes("7")) return "dia";
  const h = d.getHours();
  if (h === 7 || h === 17 || h === 19) return "hora";
  if (String(d.getMinutes()).padStart(2, "0").includes("7")) return "minuto";
  return null;
}

/* A clock that only ticks once a minute, so whole screens don't re-render every second. */
let minute = 0;
let timer: number | undefined;
const listeners = new Set<() => void>();

function subscribe(l: () => void) {
  listeners.add(l);
  if (listeners.size === 1) {
    minute = Math.floor(Date.now() / 60_000);
    timer = window.setInterval(() => {
      const m = Math.floor(Date.now() / 60_000);
      if (m === minute) return;
      minute = m;
      for (const fn of listeners) fn();
    }, 2000);
  }
  return () => {
    listeners.delete(l);
    if (listeners.size === 0) window.clearInterval(timer);
  };
}

function snapshot() {
  if (!minute) minute = Math.floor(Date.now() / 60_000);
  return minute;
}

/** The current minute (as a Date), or null on the server. */
export function useMinute() {
  const m = useSyncExternalStore(subscribe, snapshot, () => 0);
  return m ? new Date(m * 60_000) : null;
}
