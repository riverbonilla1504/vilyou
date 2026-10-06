"use client";

import { motion } from "framer-motion";
import { PixelSprite } from "./pixel/PixelSprite";

/** Seven little stars that light up one by one. */
export function SevenStars() {
  return (
    <div className="card-inset px-4 py-4">
      <div className="text-sm uppercase tracking-[0.18em] text-rose-dark">Señal del 7</div>
      <motion.div
        className="mt-3 flex items-center justify-between gap-1"
        initial="off"
        whileInView="on"
        viewport={{ once: true, amount: 0.8 }}
        transition={{ staggerChildren: 0.22, delayChildren: 0.2 }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.span
            key={i}
            variants={{
              off: { opacity: 0.25, scale: 0.6, filter: "grayscale(1)" },
              on: {
                opacity: 1,
                scale: [0.6, 1.5, 1],
                filter: "grayscale(0)",
                transition: { duration: 0.45 },
              },
            }}
          >
            <PixelSprite name="sparkle" scale={5} className="star-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          </motion.span>
        ))}
      </motion.div>
      <p className="mt-3 text-base text-ink-soft">Siete estrellitas, siete razones para elegirte.</p>
    </div>
  );
}
