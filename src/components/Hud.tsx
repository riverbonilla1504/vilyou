"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { pop, soundStore } from "@/lib/sound";
import { PixelSprite } from "./pixel/PixelSprite";

/** Floating game-style HUD: logo, the current "date" box and a sound toggle. */
export function Hud({ label, title }: { label: string; title: string }) {
  const soundOn = soundStore.useValue();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-4">
      <motion.a
        href="#inicio"
        className="hud-box frame-wood pointer-events-auto flex items-center gap-2 px-2 py-1.5 text-ink sm:px-2.5"
        aria-label="VILyou, volver al inicio"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      >
        <PixelSprite name="heart" scale={2} className="anim-late" />
        <span className="hidden text-lg leading-none sm:inline sm:text-xl">VILyou</span>
      </motion.a>

      <motion.div
        className="pointer-events-auto flex items-start gap-2"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="hud-box frame-wood min-w-[120px] max-w-[200px] overflow-hidden px-3 py-1.5 text-right text-ink sm:min-w-[190px] sm:max-w-none">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={label + title}
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 14, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="font-press text-[8px] uppercase text-ink-soft sm:text-[9px]">{label}</div>
              <div className="mt-1 truncate text-base leading-none sm:text-lg">{title}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => {
            soundStore.set((v) => !v);
            pop();
          }}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Silenciar sonidos" : "Activar sonidos"}
          className="slot grid h-11 w-11 place-items-center text-ink sm:h-12 sm:w-12"
        >
          {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 opacity-60" />}
        </button>
      </motion.div>
    </div>
  );
}
