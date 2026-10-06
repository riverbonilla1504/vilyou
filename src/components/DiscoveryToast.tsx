"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { porId, TOTAL } from "@/content/descubrimientos";
import { textosMusica } from "@/content/musica";
import { discoveredStore, dismissToast, toastStore } from "@/lib/discoveries";
import { cancionPorId, isHiddenSong, seenIndex, TOTAL_CANCIONES } from "@/lib/songs";
import { PixelSprite } from "./pixel/PixelSprite";

/** "¡Nuevo descubrimiento!" notifications, one at a time. */
export function DiscoveryToast() {
  const queue = toastStore.useValue();
  const found = discoveredStore.useValue();
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const t = window.setTimeout(() => dismissToast(current.key), 3400);
    return () => window.clearTimeout(t);
  }, [current]);

  const songId = current?.id.startsWith("song:") ? current.id.slice(5) : null;
  const song = songId ? cancionPorId[songId] : null;
  const item = song
    ? {
        sprite: "vinyl" as const,
        titulo: `${song.titulo} · ${song.artista}`,
        etiqueta: `${isHiddenSong(song.id) ? textosMusica.notaEncontrada : textosMusica.nuevaCancion} · ${seenIndex(song.id)}/${TOTAL_CANCIONES}`,
      }
    : current && porId[current.id]
      ? {
          ...porId[current.id],
          etiqueta: `¡Nuevo descubrimiento! · ${Math.max(1, found.indexOf(current.id) + 1)}/${TOTAL}`,
        }
      : null;

  return (
    <div className="toast-zone pointer-events-none fixed inset-x-0 z-[70] flex justify-center px-3">
      <AnimatePresence mode="wait">
        {current && item ? (
          <motion.button
            key={current.key}
            type="button"
            onClick={() => dismissToast(current.key)}
            className="frame-wood toast pointer-events-auto flex max-w-[360px] items-center gap-3 px-2 py-1.5 text-left text-ink"
            initial={{ y: -70, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            <motion.span
              className="slot slot-found grid h-12 w-12 shrink-0 place-items-center"
              initial={{ rotate: -20, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 12, delay: 0.1 }}
            >
              <PixelSprite name={item.sprite} scale={2} className="max-h-[32px] max-w-[36px]" />
            </motion.span>
            <span className="min-w-0">
              <span className="block text-xs text-rose-dark">{item.etiqueta}</span>
              <span className="block truncate text-base leading-tight">{item.titulo}</span>
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
