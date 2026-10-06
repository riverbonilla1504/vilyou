import {
  cositasPorCancion,
  dedicada,
  escondidas,
  nuestra,
  pistasEscondites,
  playlist,
  textosMusica,
  type Cancion,
  type Escondite,
} from "@/content/musica";
import { useIsPast } from "./clock";
import { discoveredStore, pushToast } from "./discoveries";
import { isOpenNow, unlockTime, useFlags } from "./flags";
import { discoStore } from "./music-state";
import { chime } from "./sound";
import { createPersistentStore } from "./store";

/**
 * The song collection. Songs are unlocked like the 77 cositas: the moon gives
 * the first one, the record in "Nuestra canción" gives ours, little notes
 * hidden around the page give some, and the rest come with every couple of
 * cositas she finds. The record in the sky only plays the ones she has.
 */

/** Songs found by hand (our song and the hidden notes). */
export const songsFoundStore = createPersistentStore<string[]>("vilyou:canciones", []);

/** Songs she has already been told about (for the "¡Canción nueva!" notice). */
const songsSeenStore = createPersistentStore<string[]>("vilyou:canciones-vistas", []);

export const todas: Cancion[] = [dedicada, nuestra, ...playlist];
export const TOTAL_CANCIONES = todas.length;

const hiddenIds = new Set<string>(Object.values(escondidas));
const porCositas = playlist.filter((c) => !hiddenIds.has(c.id));
const escondite = Object.fromEntries(
  (Object.entries(escondidas) as [Escondite, string][]).map(([spot, id]) => [id, spot]),
) as Record<string, Escondite>;

export const cancionPorId = Object.fromEntries(todas.map((c) => [c.id, c])) as Record<string, Cancion>;

export function isHiddenSong(id: string) {
  return hiddenIds.has(id);
}

function computeUnlocked(open: boolean, disco: boolean, found: string[], cositas: number) {
  const ids = new Set<string>();
  if (disco) ids.add(dedicada.id);
  if (open) {
    for (const id of found) if (cancionPorId[id]) ids.add(id);
    porCositas.slice(0, Math.floor(cositas / cositasPorCancion)).forEach((c) => ids.add(c.id));
  }
  return ids;
}

/** The songs she has right now (outside React). */
export function unlockedSongs(): Cancion[] {
  const ids = computeUnlocked(isOpenNow(), discoStore.get(), songsFoundStore.get(), discoveredStore.get().length);
  return todas.filter((c) => ids.has(c.id));
}

function hintFor(c: Cancion) {
  if (c.id === dedicada.id) return textosMusica.pistaLuna;
  if (c.id === nuestra.id) return textosMusica.pistaNuestra;
  if (escondite[c.id]) return pistasEscondites[escondite[c.id]];
  return textosMusica.pistaCositas((porCositas.indexOf(c) + 1) * cositasPorCancion);
}

export type SongStatus = { song: Cancion; unlocked: boolean; hint: string };

/** Is the countdown over? (River's preview counts as over.) */
export function useIsOpen() {
  const flags = useFlags();
  const past = useIsPast(unlockTime());
  if (flags.forceLockUntil) return past === true;
  return flags.preview || past === true;
}

/** Every song with whether she has it, for the turntable. */
export function useSongs() {
  const open = useIsOpen();
  const disco = discoStore.useValue();
  const found = songsFoundStore.useValue();
  const cositas = discoveredStore.useValue().length;
  const ids = computeUnlocked(open, disco, found, cositas);
  const list: SongStatus[] = todas.map((song) => ({ song, unlocked: ids.has(song.id), hint: hintFor(song) }));
  return { list, open, count: ids.size, ids };
}

/** Marks a song as found by hand (a hidden note, our song). */
export function findSong(id: string) {
  if (!cancionPorId[id] || songsFoundStore.get().includes(id)) return false;
  songsFoundStore.set((s) => [...s, id]);
  return true;
}

/**
 * Called whenever the unlocked set may have grown: shows "¡Canción nueva!"
 * for each song she hasn't been told about and returns them.
 */
export function announceNewSongs(ids: Set<string>) {
  const seen = songsSeenStore.get();
  const fresh = todas.filter((c) => ids.has(c.id) && !seen.includes(c.id));
  if (!fresh.length) return [];
  songsSeenStore.set([...seen, ...fresh.map((c) => c.id)]);
  // The dedicated song announces itself with the dialogue instead.
  const toAnnounce = fresh.filter((c) => c.id !== dedicada.id);
  if (toAnnounce.length) chime();
  for (const c of toAnnounce) pushToast(`song:${c.id}`);
  return fresh;
}

/** Position of a song in the order she collected them (for the notice). */
export function seenIndex(id: string) {
  return songsSeenStore.get().indexOf(id) + 1;
}
