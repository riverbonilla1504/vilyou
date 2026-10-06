"use client";

import { AnimatePresence, motion } from "framer-motion";
import { escondidas, type Escondite } from "@/content/musica";
import { queueNext } from "@/lib/music";
import { cancionPorId, findSong, songsFoundStore, useIsOpen } from "@/lib/songs";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";

const glowNote = { K: "#f3e6ff" };

/**
 * A little music note hidden somewhere. Tapping it unlocks a song for the
 * record player. Only appears once the countdown is over.
 */
export function HiddenNote({ spot, className }: { spot: Escondite; className?: string }) {
  const open = useIsOpen();
  const found = songsFoundStore.useValue();
  const id = escondidas[spot];
  const visible = open && !found.includes(id);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Una notita musical"
          className={cn("absolute z-20 grid h-11 w-11 place-items-center", className)}
          exit={{ scale: 2.2, opacity: 0, y: -40, transition: { duration: 0.6 } }}
          onClick={(e) => {
            e.stopPropagation();
            if (findSong(id)) queueNext(cancionPorId[id]);
          }}
        >
          <PixelSprite name="note" scale={3} palette={glowNote} className="hidden-note" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
