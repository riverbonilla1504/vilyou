"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { momento7 } from "@/content/mochila";
import { achieve } from "@/lib/songs";
import { chime } from "@/lib/sound";
import { sieteEn, useMinute } from "@/lib/timeOfDay";
import { PixelSprite } from "./pixel/PixelSprite";

const gold = { K: "#6b3a07", Y: "#ffd54f" };

/**
 * A "momento 7": when the day, the hour or the minute has a 7, little golden
 * sevens float across the screen and a chip says why. The first one ever
 * gives her a song.
 */
export function SevenMoment() {
  const now = useMinute();
  const reason = now ? sieteEn(now) : null;
  const label = reason ? momento7[reason] : null;

  useEffect(() => {
    if (!reason) return;
    chime();
    achieve("momento7");
  }, [reason]);

  const sevens = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        left: 6 + i * 13.5,
        delay: i * 1.3,
        duration: 11 + (i % 3) * 3,
      })),
    [],
  );

  return (
    <AnimatePresence>
      {label ? (
        <motion.div
          key={reason}
          aria-live="polite"
          className="pointer-events-none fixed inset-0 z-[12]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {sevens.map((s, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0"
              style={{ left: `${s.left}%` }}
              initial={{ y: "5vh", opacity: 0 }}
              animate={{ y: "-105vh", opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "linear" }}
            >
              <PixelSprite name="seven" scale={3} palette={gold} className="seven-glow" />
            </motion.span>
          ))}
          <motion.div
            className="seven-chip absolute left-1/2 flex -translate-x-1/2 items-center gap-2 px-3 py-1.5"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <PixelSprite name="seven" scale={2} palette={gold} />
            <span className="whitespace-nowrap text-sm text-cream">{label}</span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
