"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { musicStore } from "@/lib/music";
import { PixelSprite } from "./pixel/PixelSprite";

const purpleNote = { K: "#e9d6ff" };

/**
 * The spinning record that takes the moon's place in the sky.
 * It speeds up and slows down smoothly with the music, like a real turntable.
 */
export function RecordDisc() {
  const music = musicStore.useValue();
  const spinning = music.playing && music.audible;
  const discRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angle = 0;
    let speed = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // Ease toward full speed (or a stop): ~1.5s to spin up, ~2s to wind down.
      const m = musicStore.get();
      const target = m.playing && m.audible ? 1 : 0;
      const rate = target > speed ? 2.2 : 1.6;
      speed += (target - speed) * (1 - Math.exp(-dt * rate));
      angle = (angle + speed * 200 * dt) % 360;
      if (discRef.current) discRef.current.style.transform = `rotate(${angle}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute left-0 top-0">
      <div className="record-pixel absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
        <div ref={discRef} className="will-change-transform">
          <PixelSprite name="vinyl" scale={4} className="block" />
        </div>
        {/* light that stays put while the record turns */}
        <span className="record-shine pointer-events-none absolute inset-0" />
      </div>

      {/* little notes float out while it plays */}
      <AnimatePresence>
        {spinning
          ? [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute"
                style={{ left: -54 + i * 40, top: -70 }}
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
