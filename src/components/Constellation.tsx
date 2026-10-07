"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { constelacion } from "@/content/constelacion";
import { X } from "lucide-react";
import { chime, fanfare, pop } from "@/lib/sound";
import { say } from "@/lib/speech";
import { createPersistentStore, createStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";

/** Once she draws it, the constellation stays lit forever. */
const doneStore = createPersistentStore<boolean>("vilyou:constelacion", false);

/** The big night sky with the constellation, opened from the countdown or the letter. */
const skyOpenStore = createStore(false);

type P = [number, number];

/** The three shapes, star by star, in the order she has to tap them (x, y in % of the box). */
const SHAPES: { points: P[]; closed?: boolean }[] = [
  // V
  { points: [[0, 0], [9, 100], [18, 0]] },
  // ♥ (from the bottom tip, around, back to the tip)
  { points: [[46, 100], [33, 42], [36, 6], [46, 24], [56, 6], [59, 42]], closed: true },
  // R
  { points: [[72, 100], [72, 0], [88, 8], [90, 38], [72, 50], [92, 100]] },
];

const STARS = SHAPES.flatMap((s, shape) => s.points.map((p, i) => ({ p, shape, i })));
const TOTAL = STARS.length;

const gold = { Y: "#ffd86b", W: "#fffbe6" };
const lilac = { Y: "#c9a6ff", W: "#f4ecff" };

/**
 * V ♥ R hidden in the sky: a few stars shine differently and, tapped in
 * order, join into their initials.
 */
export function Constellation({ className }: { className?: string }) {
  const done = doneStore.useValue();
  const [count, setCount] = useState(0);
  const [nope, setNope] = useState<number | null>(null);
  const [justDone, setJustDone] = useState(false);
  const lit = done ? TOTAL : count;

  const tap = (index: number) => {
    if (done) return;
    if (index !== count) {
      setNope(index);
      window.setTimeout(() => setNope(null), 400);
      return;
    }
    const next = count + 1;
    setCount(next);
    if (next < TOTAL) {
      chime();
      return;
    }
    fanfare();
    setJustDone(true);
    doneStore.set(true);
    window.setTimeout(() => say(constelacion.completada, { corazones: true }), 1400);
  };

  // Lines between stars of the same shape that are both lit.
  const lines: { from: P; to: P; key: string }[] = [];
  let k = 0;
  SHAPES.forEach((s, shape) => {
    const start = k;
    for (let i = 1; i < s.points.length; i++) {
      if (start + i < lit) lines.push({ from: s.points[i - 1], to: s.points[i], key: `${shape}-${i}` });
    }
    if (s.closed && start + s.points.length <= lit) {
      lines.push({ from: s.points[s.points.length - 1], to: s.points[0], key: `${shape}-close` });
    }
    k += s.points.length;
  });

  return (
    <div className={cn("constellation pointer-events-none", className)} aria-label="Una constelación escondida">
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <AnimatePresence>
          {lines.map((l) => (
            <motion.line
              key={l.key}
              x1={l.from[0]}
              y1={l.from[1]}
              x2={l.to[0]}
              y2={l.to[1]}
              className={done ? "constellation-line-done" : "constellation-line"}
              vectorEffect="non-scaling-stroke"
              // Opacity only: Safari mis-draws pathLength together with non-scaling strokes.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </svg>

      {STARS.map((s, index) => {
        const on = index < lit;
        const isNext = !done && index === count;
        return (
          <motion.button
            key={index}
            type="button"
            tabIndex={-1}
            aria-label={on ? "Estrella encendida" : "Estrella"}
            disabled={done}
            onClick={() => tap(index)}
            className={cn(
              "absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center",
              done ? "pointer-events-none" : "pointer-events-auto",
            )}
            style={{ left: `${s.p[0]}%`, top: `${s.p[1]}%` }}
            animate={nope === index ? { x: [0, -5, 5, -3, 0] } : undefined}
            transition={{ duration: 0.3 }}
          >
            {isNext ? <span className="constellation-next absolute inset-1 rounded-full" /> : null}
            <PixelSprite
              name="sparkle"
              scale={on ? 3 : 2}
              palette={on ? gold : lilac}
              className={cn(
                "relative transition-transform",
                on ? "constellation-star-on" : "constellation-star",
                isNext && "scale-125",
              )}
              style={on || isNext ? undefined : { animationDelay: `${(index * 0.37) % 2.4}s` }}
            />
          </motion.button>
        );
      })}

      {/* a little shower of sparkles when it's finished */}
      <AnimatePresence>
        {justDone
          ? STARS.map((s, i) => (
              <motion.span
                key={`b${i}`}
                className="absolute"
                style={{ left: `${s.p[0]}%`, top: `${s.p[1]}%` }}
                initial={{ scale: 0.4, opacity: 1, x: 0, y: 0 }}
                animate={{ scale: 1.6, opacity: 0, x: ((i * 29) % 40) - 20, y: -18 - ((i * 17) % 22) }}
                transition={{ duration: 1.2, delay: i * 0.03 }}
                onAnimationComplete={() => i === TOTAL - 1 && setJustDone(false)}
              >
                <PixelSprite name="heartSmall" scale={2} palette={{ R: "#ffd86b", W: "#fffbe6" }} />
              </motion.span>
            ))
          : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * A special star in the sky of the countdown and the letter. It pulses until
 * the constellation is drawn; tapping it opens the big night sky.
 */
export function ConstellationStar({ className }: { className?: string }) {
  const done = doneStore.useValue();
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label="Una estrella distinta"
      className={cn("absolute z-20 grid h-12 w-12 place-items-center", className)}
      onClick={() => {
        pop();
        skyOpenStore.set(true);
      }}
    >
      {!done ? <span className="constellation-next absolute inset-2 rounded-full" /> : null}
      <PixelSprite
        name="sparkle"
        scale={3}
        palette={done ? gold : lilac}
        className={done ? "constellation-star-on relative" : "relative"}
      />
    </button>
  );
}

/** The night sky where she joins the stars (lives at the root, like the dialogues). */
export function ConstellationSky() {
  const open = skyOpenStore.useValue();
  const done = doneStore.useValue();
  const close = () => {
    pop();
    skyOpenStore.set(false);
  };
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="sky"
          role="dialog"
          aria-modal="true"
          aria-label="Une las estrellas"
          className="constellation-sky-bg fixed inset-0 z-[57] flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <button
            type="button"
            onClick={close}
            className="slot absolute right-3 top-[max(12px,env(safe-area-inset-top))] grid h-11 w-11 place-items-center text-ink"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" strokeWidth={3} />
          </button>

          <motion.p
            className="on-scene mb-10 text-center text-xl text-cream/85"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {done ? "V ♥ R, escrito en el cielo" : "Une las estrellas, empezando por la que late ✦"}
          </motion.p>
          <Constellation className="constellation-big" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

