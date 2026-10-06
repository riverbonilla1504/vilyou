"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cuentaRegresiva } from "@/content/cuentaRegresiva";
import { dedicada } from "@/content/musica";
import { useNow } from "@/lib/clock";
import { playSnippet } from "@/lib/music";
import { fanfare, tick } from "@/lib/sound";
import { PixelSprite } from "./pixel/PixelSprite";

const FINAL_MS = 10_000;
const BOOM_MS = 4800;

const purpleHeart = { K: "#2a0f4a", R: "#b46cff", W: "#ead6ff", D: "#8a3fe0" };
const tulipColors = [
  undefined,
  { R: "#ffd54f", L: "#fff1a8", D: "#e0a92a" },
  { R: "#c58cff", L: "#ead4ff", D: "#9a5ee0" },
  { R: "#ff8fc0", L: "#ffd6e6", D: "#e0558f" },
];

/**
 * The last 10 seconds: the screen goes dark, the number gets huge, and at
 * zero tulips and purple hearts burst out while a bit of Chachacha plays.
 */
export function FinalCountdown({ unlockAt }: { unlockAt: number }) {
  const now = useNow();
  const left = now ? unlockAt - now : Infinity;
  const inFinal = left > 0 && left <= FINAL_MS;
  const seconds = Math.ceil(left / 1000);
  // Only celebrate if she was actually here for the countdown.
  const [sawFinal, setSawFinal] = useState(false);
  const [boom, setBoom] = useState(false);
  const lastTick = useRef<number | null>(null);

  if (inFinal && !sawFinal) setSawFinal(true);
  if (sawFinal && !boom && left <= 0) setBoom(true);

  useEffect(() => {
    if (!inFinal || lastTick.current === seconds) return;
    lastTick.current = seconds;
    tick();
  }, [inFinal, seconds]);

  useEffect(() => {
    if (!boom) return;
    tick(true);
    window.setTimeout(fanfare, 250);
    playSnippet(dedicada, cuentaRegresiva.pedacito.desde, cuentaRegresiva.pedacito.dura);
    const t = window.setTimeout(() => setSawFinal(false), BOOM_MS);
    return () => window.clearTimeout(t);
  }, [boom]);

  const show = inFinal || (boom && sawFinal);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="final"
          className="pointer-events-none fixed inset-0 z-[60] grid place-items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2 } }}
          transition={{ duration: 1 }}
          aria-live="assertive"
        >
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgb(48_16_84/0.94),rgb(5_2_14/0.97)_70%)]"
            animate={boom ? { opacity: 0.7 } : { opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {!boom ? (
            <div className="relative flex flex-col items-center px-6 text-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={seconds}
                  className="final-number font-press text-[120px] leading-none text-cream sm:text-[180px]"
                  initial={{ scale: 1.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  {seconds}
                </motion.span>
              </AnimatePresence>
              <motion.p
                className="on-scene mt-8 text-xl text-cream/85"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {cuentaRegresiva.ultimos.texto}
              </motion.p>
            </div>
          ) : (
            <>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
              <Burst />
              <motion.p
                className="final-number on-scene absolute inset-x-0 top-[24%] px-6 text-center text-4xl leading-tight text-cream sm:text-6xl"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.15, 1], opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                {cuentaRegresiva.ultimos.alFinal}
              </motion.p>
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Tulips and purple hearts exploding out of the middle of the screen, in two waves. */
function Burst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + (i % 2) * 0.14;
        const reach = 38 + ((i * 37) % 24);
        return {
          x: Math.cos(angle) * reach,
          y: Math.sin(angle) * reach,
          rotate: ((i * 53) % 360) - 180,
          delay: i < 22 ? 0 : 0.35,
          tulip: i % 3 !== 0,
          palette: tulipColors[i % tulipColors.length],
          scale: 2 + (i % 3),
        };
      }),
    [],
  );

  return (
    <div className="absolute inset-0">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2"
          initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
          animate={{
            x: `${b.x}vmax`,
            y: [`0vmax`, `${b.y}vmax`, `${b.y + 18}vmax`],
            scale: 1,
            rotate: b.rotate,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 3.4, delay: b.delay, ease: "easeOut" }}
        >
          {b.tulip ? (
            <PixelSprite name="tulip" scale={b.scale} palette={b.palette} />
          ) : (
            <PixelSprite name="heart" scale={b.scale} palette={purpleHeart} />
          )}
        </motion.span>
      ))}
    </div>
  );
}
