"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { letras } from "@/content/letras";
import { musicStore, progress } from "@/lib/music";
import { PixelSprite } from "./pixel/PixelSprite";

const SHOW_MS = 4200;
const noteColor = { K: "#e9d6ff" };

type Line = { key: string; texto: string; x: number; y: number; down: boolean };

/** Where the words come out of: a record on screen, or the turntable button. */
function anchor() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const candidates = [
    ...document.querySelectorAll<HTMLElement>("[role=dialog] .deck"),
    ...document.querySelectorAll<HTMLElement>(".place .deck"),
    ...document.querySelectorAll<HTMLElement>(".record-pixel"),
    ...document.querySelectorAll<HTMLElement>("[aria-label^='Tocadiscos']"),
  ];
  for (const el of candidates) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw) {
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height };
    }
  }
  return { x: vw / 2, y: vh * 0.7, h: 0 };
}

/**
 * Lines from `src/content/letras.ts` floating out of the record at the right
 * second of the song.
 */
export function FloatingLyrics() {
  const [lines, setLines] = useState<Line[]>([]);
  const shown = useRef(new Set<string>());
  const last = useRef({ track: "", time: 0 });

  useEffect(() => {
    const id = window.setInterval(() => {
      const m = musicStore.get();
      const track = m.track?.id ?? "";
      const { current } = progress();
      // A new song, or she went back: the lines can come out again.
      if (track !== last.current.track || current < last.current.time - 1.5) shown.current.clear();
      last.current = { track, time: current };
      if (!track || !m.playing || !m.audible) return;

      (letras[track] ?? []).forEach((l, i) => {
        const key = `${track}:${i}`;
        if (shown.current.has(key) || current < l.segundo || current > l.segundo + 2) return;
        shown.current.add(key);
        const a = anchor();
        const vw = window.innerWidth;
        const down = a.y < window.innerHeight * 0.3;
        const line: Line = {
          key: `${key}:${Date.now()}`,
          texto: l.texto,
          x: Math.min(vw - 110, Math.max(110, a.x)),
          y: down ? a.y + a.h / 2 + 8 : a.y - a.h / 2 - 8,
          down,
        };
        setLines((ls) => [...ls.slice(-2), line]);
        window.setTimeout(() => setLines((ls) => ls.filter((x) => x.key !== line.key)), SHOW_MS);
      });
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-0 z-[67]">
      <AnimatePresence>
        {lines.map((l) => (
          <motion.div
            key={l.key}
            className={`absolute flex w-[220px] -translate-x-1/2 flex-col items-center ${l.down ? "" : "-translate-y-full"}`}
            style={{ left: l.x, top: l.y }}
            initial={{ opacity: 0, y: l.down ? -10 : 10, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], y: l.down ? 70 : -80, scale: 1 }}
            transition={{
              duration: SHOW_MS / 1000,
              ease: "easeOut",
              opacity: { duration: SHOW_MS / 1000, times: [0, 0.15, 0.75, 1] },
            }}
          >
            <PixelSprite name="note" scale={2} palette={noteColor} className="mb-1" />
            <p className="lyric lyric-bubble px-3 py-1.5 text-center text-xl leading-tight text-cream">{l.texto}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
