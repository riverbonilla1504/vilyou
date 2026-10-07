"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { tulipanGigante } from "@/content/tulipan";
import { discover } from "@/lib/discoveries";
import { FLOWERS, giantTulipStore, litFlowersStore, tapFlower } from "@/lib/flowers";
import { chime, fanfare, pop } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";

const tulipColors = [
  undefined,
  { R: "#ffd54f", L: "#fff1a8", D: "#e0a92a" },
  { R: "#c58cff", L: "#ead4ff", D: "#9a5ee0" },
  { R: "#ff8fc0", L: "#ffd6e6", D: "#e0558f" },
];

const SHOW_MS = 11_000;

/**
 * The 7 ground flowers. Each one hops when tapped and keeps a little sparkle;
 * once all 7 sparkle, the giant tulip grows.
 */
export function FlowerRow({
  interactive = true,
  className,
  onTap,
}: {
  interactive?: boolean;
  className?: string;
  onTap?: (e: React.MouseEvent) => void;
}) {
  const lit = litFlowersStore.useValue();
  const [hop, setHop] = useState<{ i: number; key: number } | null>(null);

  return (
    <div className={cn("flex items-end justify-around", className)}>
      {FLOWERS.map((f, i) => {
        const on = lit.includes(i);
        const art = (
          <>
            <motion.span
              key={hop?.i === i ? hop.key : "still"}
              className="block"
              animate={hop?.i === i ? { y: [0, -18, 0], rotate: [0, -10, 8, 0], scale: [1, 1.2, 1] } : undefined}
              transition={{ duration: 0.55 }}
            >
              <PixelSprite name={f.sprite} scale={3} palette={f.palette} />
            </motion.span>
            <AnimatePresence>
              {on ? (
                <motion.span
                  className="flower-lit pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <PixelSprite name="sparkle" scale={2} />
                </motion.span>
              ) : null}
            </AnimatePresence>
          </>
        );
        return interactive ? (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            aria-label={f.sprite === "lily" ? "Lirio" : "Tulipán"}
            className="garden-flower relative block p-1"
            style={{ marginBottom: f.lift }}
            onClick={(e) => {
              pop();
              setHop((h) => ({ i, key: (h?.key ?? 0) + 1 }));
              onTap?.(e);
              discover("tulipan-pixel");
              if (!on && lit.length < FLOWERS.length - 1) chime();
              tapFlower(i);
            }}
          >
            {art}
          </button>
        ) : (
          <span key={i} className="relative block p-1" style={{ marginBottom: f.lift }}>
            {art}
          </span>
        );
      })}
    </div>
  );
}

/** Rain of tulips and a giant one growing in the middle of the screen. */
export function GiantTulip() {
  const open = giantTulipStore.useValue();

  useEffect(() => {
    if (!open) return;
    fanfare();
    const c = window.setTimeout(chime, 900);
    const t = window.setTimeout(() => giantTulipStore.set(false), SHOW_MS);
    return () => {
      window.clearTimeout(c);
      window.clearTimeout(t);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.button
          key="giant-tulip"
          type="button"
          aria-label={tulipanGigante.texto}
          className="fixed inset-0 z-[58] block overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          onClick={() => {
            pop();
            giantTulipStore.set(false);
          }}
        >
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgb(120_40_90/0.88),rgb(14_6_28/0.93)_70%)]" />
          <TulipRain />

          <span className="giant-tulip-glow absolute bottom-[8%] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full" />
          <motion.span
            className="absolute bottom-[10%] left-1/2 block origin-bottom -translate-x-1/2"
            initial={{ scaleY: 0, scaleX: 0.3 }}
            animate={{ scaleY: 1, scaleX: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 11, delay: 0.5 }}
          >
            <motion.span
              className="block origin-bottom"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PixelSprite name="tulip" scale={16} className="giant-tulip block max-h-[46vh] w-auto" />
            </motion.span>
          </motion.span>

          <motion.span
            className="final-number on-scene absolute inset-x-0 top-[16%] block px-6 text-center text-3xl leading-tight text-cream"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {tulipanGigante.texto}
          </motion.span>
          <motion.span
            className="on-scene absolute inset-x-0 bottom-[3%] block text-center text-sm text-cream/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
          >
            {tulipanGigante.pie}
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

function TulipRain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        left: (i * 41) % 100,
        delay: (i % 15) * 0.32 + (i >= 15 ? 0.2 : 0),
        duration: 3.6 + ((i * 7) % 5) * 0.45,
        scale: 2 + (i % 3),
        palette: tulipColors[i % tulipColors.length],
        spin: i % 2 ? 160 : -160,
      })),
    [],
  );
  return (
    <span className="absolute inset-0">
      {drops.map((d, i) => (
        <motion.span
          key={i}
          className="absolute top-0 block"
          style={{ left: `${d.left}%` }}
          initial={{ y: "-12vh", rotate: 0, opacity: 0 }}
          animate={{ y: "110vh", rotate: d.spin, opacity: [0, 1, 1, 0.8] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: 1, ease: "linear" }}
        >
          <PixelSprite name="tulip" scale={d.scale} palette={d.palette} />
        </motion.span>
      ))}
    </span>
  );
}
