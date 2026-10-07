"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { abrazo, botella, modoNoche, nombreEstrellas, pinkyEscondida } from "@/content/sorpresas";
import { discover } from "@/lib/discoveries";
import { achieve } from "@/lib/songs";
import { chime, fanfare, pop, swoosh } from "@/lib/sound";
import { say } from "@/lib/speech";
import { createPersistentStore } from "@/lib/store";
import { useMinute } from "@/lib/timeOfDay";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";

const purpleHeart = { K: "#2a0f4a", R: "#b46cff", W: "#ead6ff", D: "#8a3fe0" };

/* ───────────────────────── modo noche ───────────────────────── */

const nightSeenStore = createPersistentStore<string>("vilyou:noche", "");

function inNight(d: Date) {
  const h = d.getHours();
  return modoNoche.desde > modoNoche.hasta ? h >= modoNoche.desde || h < modoNoche.hasta : h >= modoNoche.desde && h < modoNoche.hasta;
}

/** Late at night the universe dims, fireflies come out and River says hi (once per night). */
export function NightMode({ enabled }: { enabled: boolean }) {
  const now = useMinute();
  const night = !!now && inNight(now);

  useEffect(() => {
    if (!night || !enabled || !now) return;
    // The night belongs to the day it started on.
    const start = new Date(now);
    if (start.getHours() < 12) start.setDate(start.getDate() - 1);
    const key = start.toDateString();
    achieve("noche");
    if (nightSeenStore.get() === key) return;
    nightSeenStore.set(key);
    const t = window.setTimeout(() => say(modoNoche.dice), 2200);
    return () => window.clearTimeout(t);
  }, [night, enabled, now]);

  const flies = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: (i * 53) % 100,
        top: 20 + ((i * 37) % 70),
        delay: (i % 9) * 0.7,
        duration: 6 + (i % 5),
        path: i % 3,
      })),
    [],
  );

  if (!night) return null;
  return (
    <div aria-hidden="true" className="night-mode pointer-events-none absolute inset-0 z-[4]">
      {flies.map((f, i) => (
        <span
          key={i}
          className={`firefly firefly-${f.path}`}
          style={{ left: `${f.left}%`, top: `${f.top}%`, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
        />
      ))}
    </div>
  );
}

/* ───────────────────────── Pinky escondida ───────────────────────── */

export type PinkySpot = "universo" | "jardin" | "pastel" | "juegos" | "historia" | "album" | "carta";
const SPOTS: PinkySpot[] = ["universo", "jardin", "pastel", "juegos", "historia", "album", "carta"];

const pinkyFoundStore = createPersistentStore<string>("vilyou:pinky", "");

function dayNumber(d: Date) {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/** Pinky hides in a different place every day; this shows her only in today's spot. */
export function HiddenPinky({ spot, className }: { spot: PinkySpot; className?: string }) {
  const now = useMinute();
  const found = pinkyFoundStore.useValue();
  const [talking, setTalking] = useState(false);
  if (!now) return null;
  const day = dayNumber(now);
  const today = now.toDateString();
  // +1 so that on the 7th of October (her first day) Pinky is right in the universe.
  if (SPOTS[(day + 1) % SPOTS.length] !== spot || (found === today && !talking)) return null;
  const line = pinkyEscondida.frases[day % pinkyEscondida.frases.length];

  return (
    <div className={cn("absolute z-20", className)}>
      <AnimatePresence>
        {talking ? (
          <motion.div
            className="speech absolute bottom-full left-1/2 mb-2 w-[200px] -translate-x-1/2 px-3 py-1.5 text-center text-sm leading-snug"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {line}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.button
        type="button"
        aria-label="Pinky escondida"
        className="block"
        animate={talking ? { y: [0, -16, 0], rotate: [0, -10, 10, 0] } : { rotate: [-8, 8, -8] }}
        transition={talking ? { duration: 0.6 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        onClick={(e) => {
          e.stopPropagation();
          if (talking) return;
          chime();
          setTalking(true);
          achieve("pinky");
          window.setTimeout(() => {
            setTalking(false);
            pinkyFoundStore.set(today);
          }, 5200);
        }}
      >
        <PixelSprite name="pinky" scale={3} className="pinky-peek" />
      </motion.button>
    </div>
  );
}

/* ───────────────────────── el abrazo ───────────────────────── */

/** Progress ring while she holds the heart, then "Abrazo enviado 💜". */
export function HugOverlay({ progress, done }: { progress: number; done: boolean }) {
  const show = done || progress >= 0;
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="hug"
          className="pointer-events-none fixed inset-0 z-[30] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {!done ? (
            <div className="flex flex-col items-center">
              <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                <circle cx="60" cy="60" r={r} stroke="rgb(255 255 255 / 0.15)" strokeWidth="8" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r={r}
                  stroke="#c38bff"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={c}
                  strokeDashoffset={c * (1 - Math.max(0, progress))}
                  strokeLinecap="round"
                />
              </svg>
              <p className="lyric lyric-bubble mt-2 px-3 py-1 text-lg text-cream">
                {abrazo.mientras} {Math.min(7, Math.floor(Math.max(0, progress) * 7) + 1)}
              </p>
            </div>
          ) : (
            <>
              <HeartBurst />
              <motion.p
                className="final-number on-scene text-center text-4xl text-cream"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.15, 1], opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                {abrazo.listo}
              </motion.p>
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** The hug finished: sound, song, River answers. */
export function onHugDone() {
  fanfare();
  achieve("abrazo");
  discover("abrazo");
  window.setTimeout(() => say(abrazo.dice, { corazones: true }), 1900);
}

function HeartBurst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const d = 30 + ((i * 17) % 20);
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, big: i % 3 === 0 };
      }),
    [],
  );
  return (
    <div className="absolute inset-0">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
          animate={{ x: `${b.x}vmin`, y: `${b.y}vmin`, opacity: [1, 1, 0], scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <PixelSprite name={b.big ? "heart" : "heartSmall"} scale={b.big ? 3 : 4} palette={b.big ? purpleHeart : { R: "#c38bff", W: "#f0e2ff" }} />
        </motion.span>
      ))}
    </div>
  );
}

/* ───────────────────────── la botella ───────────────────────── */

/** The letter that came in the bottle. */
export function BottleLetter({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    swoosh();
    achieve("botella");
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="bottle"
          role="dialog"
          aria-modal="true"
          aria-label={botella.titulo}
          className="fixed inset-0 z-[63] flex items-center justify-center overflow-y-auto bg-[#0b0618]/75 px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            className="frame-paper paper-texture relative w-full max-w-[420px] px-5 pb-6 pt-8 text-ink [overflow-wrap:anywhere]"
            initial={{ y: 40, rotate: -3, scale: 0.85 }}
            animate={{ y: 0, rotate: -1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <PixelSprite name="bottle" scale={4} className="absolute -top-9 left-1/2 -translate-x-1/2 rotate-12" />
            <button
              type="button"
              onClick={() => {
                pop();
                onClose();
              }}
              className="slot absolute right-2 top-2 grid h-10 w-10 place-items-center"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" strokeWidth={3} />
            </button>
            <h3 className="pr-10 text-xl text-rose-dark">{botella.titulo}</h3>
            {botella.parrafos.map((p, i) => (
              <motion.p
                key={i}
                className="mt-3 text-lg leading-[1.55]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.35 }}
              >
                {p}
              </motion.p>
            ))}
            <p className="mt-5 text-right text-xl text-rose-dark">{botella.firma}</p>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ───────────────────────── su nombre en las estrellas ───────────────────────── */

const FONT: Record<string, string[]> = {
  A: [".XXX.", "X...X", "X...X", "XXXXX", "X...X", "X...X", "X...X"],
  E: ["XXXXX", "X....", "X....", "XXXX.", "X....", "X....", "XXXXX"],
  I: ["XXX", ".X.", ".X.", ".X.", ".X.", ".X.", "XXX"],
  L: ["X....", "X....", "X....", "X....", "X....", "X....", "XXXXX"],
  R: ["XXXX.", "X...X", "X...X", "XXXX.", "X.X..", "X..X.", "X...X"],
  V: ["X...X", "X...X", "X...X", "X...X", ".X.X.", ".X.X.", "..X.."],
};

/** Stars fly in from everywhere and spell her name for a few seconds. */
export function NameInStars({ show, onDone }: { show: boolean; onDone: () => void }) {
  const dots = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    let col = 0;
    for (const ch of nombreEstrellas.nombre.toUpperCase()) {
      const g = FONT[ch];
      if (!g) {
        col += 3;
        continue;
      }
      g.forEach((row, y) => [...row].forEach((c, x) => c === "X" && out.push({ x: col + x, y })));
      col += g[0].length + 1;
    }
    const width = col - 1;
    return out.map((d, i) => ({
      ...d,
      left: 50 + ((d.x - width / 2) / width) * 84,
      top: 38 + (d.y - 3) * 2.6,
      fromX: ((i * 61) % 100) - 50,
      fromY: ((i * 37) % 100) - 50,
    }));
  }, []);

  useEffect(() => {
    if (!show) return;
    chime();
    achieve("nombre");
    const t = window.setTimeout(() => {
      onDone();
      say(nombreEstrellas.dice);
    }, 5200);
    return () => window.clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="name"
          aria-label={nombreEstrellas.nombre}
          className="pointer-events-none fixed inset-0 z-[30]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          <div className="absolute inset-0 bg-[#05031a]/55" />
          {dots.map((d, i) => (
            <motion.span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${d.left}%`, top: `${d.top}%` }}
              initial={{ x: `${d.fromX}vw`, y: `${d.fromY}vh`, opacity: 0, scale: 0.4 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, delay: (i % 12) * 0.04, ease: "easeOut" }}
            >
              <PixelSprite name="sparkle" scale={2} palette={{ Y: "#ffd86b", W: "#fffbe6" }} className="name-star" />
            </motion.span>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
