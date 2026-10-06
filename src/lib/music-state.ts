import type { Cancion } from "@/content/musica";
import { createPersistentStore, createStore } from "./store";

/** Once true, the moon is a record for good. */
export const discoStore = createPersistentStore<boolean>("vilyou:disco", false);

export type MusicState = {
  /** Wants to be playing (false while paused by her). */
  playing: boolean;
  /** Sound is actually coming out (false while waiting for the first tap). */
  audible: boolean;
  track: Cancion | null;
};

export const musicStore = createStore<MusicState>({ playing: false, audible: false, track: null });

/** The turntable panel (song list and controls). */
export const turntableStore = createStore(false);

/** She has flicked the record once, so the swipe hint can go. */
export const swipedStore = createPersistentStore<boolean>("vilyou:deslizo", false);
