import { useSyncExternalStore } from "react";
import { config, localTime } from "@/content/config";
import { createPersistentStore } from "./store";

type Flags = { preview: boolean; forceLockUntil: number | null };

const SERVER: Flags = { preview: false, forceLockUntil: null };
let flags: Flags | null = null;

/** Reads the testing switches from the URL once (?vista=river, ?bloqueo=1, ?reiniciar=1). */
function getFlags(): Flags {
  if (typeof window === "undefined") return SERVER;
  if (flags) return flags;

  const params = new URLSearchParams(window.location.search);

  if (params.has("reiniciar")) {
    try {
      for (const key of Object.keys(window.localStorage)) {
        if (key.startsWith("vilyou:")) window.localStorage.removeItem(key);
      }
    } catch {
      // Storage blocked: nothing to reset.
    }
    window.setTimeout(() => window.location.replace(window.location.pathname), 0);
    flags = SERVER;
    return flags;
  }

  let preview = false;
  try {
    preview = window.localStorage.getItem("vilyou:preview") === "1";
    const vista = params.get("vista");
    if (vista === config.claveVistaPrevia) {
      preview = true;
      window.localStorage.setItem("vilyou:preview", "1");
    } else if (vista === "ella") {
      preview = false;
      window.localStorage.removeItem("vilyou:preview");
    }
  } catch {
    // Ignore storage errors.
  }

  flags = {
    preview,
    forceLockUntil: params.has("bloqueo") ? Date.now() + 10_000 : null,
  };

  // Tidy the URL after this render: Next's router listens to history changes
  // and must not be updated while a component is rendering.
  if (window.location.search) {
    window.setTimeout(() => window.history.replaceState(window.history.state, "", window.location.pathname), 0);
  }
  return flags;
}

const noop = () => () => {};

export function useFlags() {
  return useSyncExternalStore(noop, getFlags, () => SERVER);
}

/** Where she is in the experience. */
export const progressStore = createPersistentStore("vilyou:progreso", {
  candado: false,
  cartaLeida: false,
  universo: false,
});

/** The days (YYYY-MM-DD) she has visited. */
export const visitsStore = createPersistentStore<string[]>("vilyou:visitas", []);

/** When the countdown ends for this visit (honors ?bloqueo=1). */
export function unlockTime() {
  return getFlags().forceLockUntil ?? localTime(config.desbloqueo);
}

/** True once the gift is open (or always, in River's preview). */
export function isOpenNow() {
  const f = getFlags();
  if (f.forceLockUntil) return Date.now() >= f.forceLockUntil;
  return f.preview || Date.now() >= localTime(config.desbloqueo);
}
