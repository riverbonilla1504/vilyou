"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { isWaitingForTap, musicStore, next, resume, swipedStore, toggle } from "@/lib/music";
import { scratch } from "@/lib/sound";
import { useRecordSpin } from "@/lib/useRecordSpin";
import { PixelSprite } from "./pixel/PixelSprite";

const purpleNote = { K: "#e9d6ff" };

/**
 * The spinning record that takes the moon's place in the sky.
 * Tap it to pause or play; flick it sideways to jump to another song.
 */
export function RecordDisc({ interactive, onTap }: { interactive: boolean; onTap?: (e: PointerEvent) => void }) {
  const music = musicStore.useValue();
  const swiped = swipedStore.useValue();
  const spinning = music.playing && music.audible;
  const discRef = useRef<HTMLDivElement>(null);
  const flick = useRecordSpin(discRef, () => {
    const m = musicStore.get();
    return m.playing && m.audible;
  });

  const disc = (
    <>
      <div ref={discRef} className="will-change-transform">
        <PixelSprite name="vinyl" scale={5} className="block" />
      </div>
      {/* light that stays put while the record turns */}
      <span className="record-shine pointer-events-none absolute inset-0" />
      <PixelSprite name="tonearm" scale={3} className="pointer-events-none absolute -right-3 -top-4" />
      <AnimatePresence>
        {!spinning ? (
          <motion.span
            className="disc-play pointer-events-none absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <span className="ml-1 text-xl leading-none text-white">▶</span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </>
  );

  return (
    <div className="absolute left-0 top-0">
      {/* soft pulse so it is obvious it can be touched */}
      <span className="disc-pulse pointer-events-none absolute left-0 top-0 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      {interactive ? (
        <motion.button
          type="button"
          tabIndex={-1}
          aria-label="Disco: toca para pausar o seguir, deslízalo para cambiar de canción"
          className="record-pixel absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2 touch-pan-y"
          whileTap={{ scale: 0.94 }}
          onTap={(e) => {
            onTap?.(e as PointerEvent);
            const m = musicStore.get();
            if (m.playing && (isWaitingForTap() || !m.audible)) resume();
            else toggle();
          }}
          onPanEnd={(_, info) => {
            if (Math.abs(info.offset.x) < 40 && Math.abs(info.velocity.x) < 350) return;
            flick(info.offset.x > 0 ? 1 : -1);
            scratch();
            swipedStore.set(true);
            next();
          }}
        >
          {disc}
        </motion.button>
      ) : (
        <div className="record-pixel absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">{disc}</div>
      )}

      {interactive && !swiped && music.track ? (
        <span className="swipe-hint pointer-events-none absolute left-[-112px] top-[-10px] font-press text-[14px] text-[#e9d6ff]">
          ‹‹
        </span>
      ) : null}

      {/* little notes float out while it plays */}
      <AnimatePresence>
        {spinning
          ? [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute"
                style={{ left: -64 + i * 46, top: -86 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PixelSprite
                  name="note"
                  scale={3}
                  palette={purpleNote}
                  className="note-float block"
                  style={{ animationDelay: `${i * 0.9}s` }}
                />
              </motion.span>
            ))
          : null}
      </AnimatePresence>
    </div>
  );
}
