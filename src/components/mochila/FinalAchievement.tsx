"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { TOTAL } from "@/content/descubrimientos";
import { logroFinal } from "@/content/logroFinal";
import { discoveredStore } from "@/lib/discoveries";
import { logroVistoStore, mochilaStore } from "@/lib/mochila";
import { TOTAL_CANCIONES, useSongs } from "@/lib/songs";
import { fanfare } from "@/lib/sound";
import { PixelSprite } from "../pixel/PixelSprite";

/** Every cosita and every song. */
export function useEverythingFound() {
  const cositas = discoveredStore.useValue().length;
  const { count } = useSongs();
  return { done: cositas >= TOTAL && count >= TOTAL_CANCIONES, cositas, canciones: count };
}

/** Opens the achievement by itself the first time she completes everything. */
export function FinalAchievementWatcher() {
  const { done } = useEverythingFound();
  const seen = logroVistoStore.useValue();
  useEffect(() => {
    if (!done || seen) return;
    // Mark it as seen only when it actually opens (marking it first cancelled the timer).
    const t = window.setTimeout(() => {
      logroVistoStore.set(true);
      mochilaStore.set("logro");
    }, 1500);
    return () => window.clearTimeout(t);
  }, [done, seen]);
  return null;
}

/** "¡Felicidades!" with confetti and a golden voucher for a special gift. */
export function FinalAchievement({ inline = false }: { inline?: boolean }) {
  const { done, cositas, canciones } = useEverythingFound();

  useEffect(() => {
    if (done) fanfare();
  }, [done]);

  if (!done) {
    return (
      <div className="flex flex-col items-center px-4 pb-4 pt-2 text-center">
        <PixelSprite name="trophy" scale={6} className="opacity-40 grayscale" />
        <p className="mt-4 text-xl">Todavía no…</p>
        <p className="mt-1 text-base text-ink-soft">Cuando encuentres todo, aquí te espera una sorpresa.</p>
        <div className="mt-4 grid w-full max-w-[280px] gap-2 text-left">
          <Bar label="Cositas" value={cositas} total={TOTAL} />
          <Bar label="Canciones" value={canciones} total={TOTAL_CANCIONES} />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center overflow-hidden px-4 pb-6 text-center ${inline ? "pt-2" : "pt-6"}`}>
      <Confetti />
      <motion.div
        initial={{ scale: 0.3, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 12 }}
      >
        <PixelSprite name="trophy" scale={7} className="trophy-glow" />
      </motion.div>
      <p className="mt-3 font-press text-[10px] text-rose-dark">{logroFinal.subtitulo.toUpperCase()}</p>
      <h3 className="mt-1 text-3xl leading-tight">{logroFinal.titulo}</h3>
      <p className="mt-3 text-lg leading-snug">{logroFinal.texto}</p>
      <motion.div
        className="golden-voucher relative mt-5 w-full max-w-[320px] px-5 py-4"
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
      >
        <PixelSprite name="ticket" scale={3} palette={{ K: "#6b3a07", P: "#fff1b8", R: "#e0a92a", H: "#ff8fc0" }} />
        <p className="mt-2 text-xl leading-snug">{logroFinal.vale}</p>
        <p className="mt-2 text-sm text-ink-soft">{logroFinal.pie}</p>
      </motion.div>
    </div>
  );
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-press text-[10px]">
          {value}/{total}
        </span>
      </div>
      <span className="progress mt-1 block">
        <span className="progress-fill block" style={{ width: `${Math.min(100, (value / total) * 100)}%` }} />
      </span>
    </div>
  );
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: (i * 47) % 100,
        delay: (i % 11) * 0.25,
        duration: 2.8 + (i % 5) * 0.4,
        heart: i % 2 === 0,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute top-0"
          style={{ left: `${b.left}%` }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: 180 }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
        >
          {b.heart ? (
            <PixelSprite name="heartSmall" scale={3} palette={{ R: "#b46cff", W: "#ead6ff" }} />
          ) : (
            <PixelSprite name="tulip" scale={2} />
          )}
        </motion.span>
      ))}
    </div>
  );
}
