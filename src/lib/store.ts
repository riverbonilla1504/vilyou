import { useSyncExternalStore } from "react";

function makeStore<T>(initial: T, persist?: { key: string }) {
  let value = initial;
  let loaded = !persist;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(persist!.key);
      if (raw != null) value = JSON.parse(raw) as T;
    } catch {
      // Private mode or blocked storage: keep the in-memory value.
    }
  }

  function get() {
    load();
    return value;
  }

  function set(next: T | ((prev: T) => T)) {
    load();
    value = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
    if (persist) {
      try {
        window.localStorage.setItem(persist.key, JSON.stringify(value));
      } catch {
        // Ignore: the value still lives for this visit.
      }
    }
    for (const l of listeners) l();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function useValue() {
    return useSyncExternalStore(subscribe, get, () => initial);
  }

  return { get, set, subscribe, useValue };
}

/**
 * Tiny localStorage-backed store. The server snapshot is always `initial`,
 * so hydration matches and the saved value appears right after.
 */
export function createPersistentStore<T>(key: string, initial: T) {
  return makeStore(initial, { key });
}

/** Same API, in memory only. */
export function createStore<T>(initial: T) {
  return makeStore(initial);
}
