"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { lugares, textosMapa } from "@/content/mapa";
import { mapaStore } from "@/lib/mochila";
import { achieve } from "@/lib/songs";
import { chime, pop } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { PixelSprite } from "../pixel/PixelSprite";

const N = 96;

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** Paints a little Stardew-like map: grass, mountains with a volcano, a river, a lake and a town. */
function paintMap(canvas: HTMLCanvasElement) {
  canvas.width = N;
  canvas.height = N;
  const g = canvas.getContext("2d")!;
  const r = rng(77);
  const px = (x: number, y: number, c: string) => {
    g.fillStyle = c;
    g.fillRect(x, y, 1, 1);
  };
  // grass
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) px(x, y, r() < 0.18 ? "#6fb85a" : r() < 0.05 ? "#8fd16f" : "#7cc46a");
  // mountains (west and north-west), with a volcano
  const peaks = [
    { x: 10, y: 30, h: 18 },
    { x: 22, y: 42, h: 24 },
    { x: 34, y: 26, h: 14 },
    { x: 8, y: 58, h: 14 },
  ];
  for (const p of peaks) {
    for (let dy = 0; dy < p.h; dy++) {
      const half = Math.floor(dy * 0.9);
      for (let dx = -half; dx <= half; dx++) {
        const x = p.x + dx;
        const y = p.y - p.h + dy;
        if (x < 0 || y < 0 || x >= N || y >= N) continue;
        px(x, y, dy < 3 ? "#f4f1ec" : dx < 0 ? "#7d6a5a" : "#5e4e42");
      }
    }
  }
  // volcano smoke
  for (let i = 0; i < 6; i++) px(22 + (i % 2), 15 - i, "#d9d2e6");
  // river from the north-east to the south-west
  for (let t = 0; t < 1; t += 0.004) {
    const x = Math.round(92 - t * 80 + Math.sin(t * 9) * 5);
    const y = Math.round(4 + t * 88);
    for (let w = 0; w < 2; w++) px(x + w, y, w ? "#7fc4f2" : "#5aa9e6");
  }
  // lake (south-east)
  for (let y = -6; y <= 6; y++)
    for (let x = -11; x <= 11; x++)
      if ((x * x) / 121 + (y * y) / 36 <= 1) px(80 + x, 78 + y, (x + y) % 5 === 0 ? "#8fd0f6" : "#5aa9e6");
  // town in the middle: little houses with red roofs
  const houses = [
    [60, 38],
    [66, 40],
    [72, 44],
    [62, 50],
    [68, 52],
    [74, 56],
    [58, 58],
    [70, 62],
  ];
  for (const [hx, hy] of houses) {
    for (let x = 0; x < 4; x++) px(hx + x, hy, "#d8406f");
    for (let x = 0; x < 4; x++) px(hx + x, hy + 1, "#c0303f");
    for (let y = 2; y < 4; y++) for (let x = 0; x < 4; x++) px(hx + x, hy + y, x === 1 && y === 3 ? "#5a3a22" : "#fff1d0");
  }
  // trees
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(r() * N);
    const y = Math.floor(r() * N);
    px(x, y, "#3f8f4a");
    px(x + 1, y, "#3f8f4a");
    px(x, y + 1, "#2f6f3a");
  }
}

/** Our places, as pins on a pixel map. */
export function PixelMap() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const visited = mapaStore.useValue();
  const [open, setOpen] = useState<number | null>(null);
  const all = visited.length >= lugares.length;

  useEffect(() => {
    if (canvas.current) paintMap(canvas.current);
  }, []);

  // A dotted path joining the places in the order we lived them.
  const path = lugares.map((l) => `${l.x},${l.y}`).join(" ");

  return (
    <div className="pb-2">
      <p className="mb-2 text-center text-sm text-ink-soft">{all ? textosMapa.completo : textosMapa.ayuda}</p>
      <div className="frame-wood relative mx-auto aspect-square w-full max-w-[460px]">
        <div className="relative h-full w-full overflow-hidden">
          <canvas ref={canvas} className="pixel-map absolute inset-0 h-full w-full" aria-hidden="true" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={path} className="map-path" vectorEffect="non-scaling-stroke" />
          </svg>
          {lugares.map((l, i) => {
            const seen = visited.includes(i);
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => {
                  pop();
                  setOpen(i);
                  if (!seen) {
                    const next = [...visited, i];
                    mapaStore.set(next);
                    if (next.length >= lugares.length) {
                      chime();
                      achieve("mapa");
                    }
                  }
                }}
                className="absolute grid h-10 w-10 -translate-x-1/2 -translate-y-full place-items-center"
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
                aria-label={l.nombre || l.fecha}
                animate={seen ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              >
                <PixelSprite
                  name="heart"
                  scale={2}
                  palette={seen ? { K: "#6b3a07", R: "#ffd54f", W: "#fff6cf", D: "#e0a92a" } : undefined}
                  className="map-pin"
                />
              </motion.button>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-center font-press text-[9px] text-ink-soft">
        {visited.length}/{lugares.length} lugares
      </p>

      <AnimatePresence>
        {open !== null ? <Place key={open} index={open} onClose={() => setOpen(null)} /> : null}
      </AnimatePresence>
    </div>
  );
}

function Place({ index, onClose }: { index: number; onClose: () => void }) {
  const l = lugares[index];
  const [photo, setPhoto] = useState(0);
  return (
    <motion.div
      className="fixed inset-0 z-[64] flex items-center justify-center bg-[#0b0618]/75 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.figure
        className="polaroid relative w-full max-w-[340px]"
        initial={{ scale: 0.7, rotate: -6 }}
        animate={{ scale: 1, rotate: -1.5 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="relative block aspect-[3/4] w-full overflow-hidden bg-[#1b1240]"
          onClick={() => {
            pop();
            setPhoto((p) => (p + 1) % l.fotos.length);
          }}
          aria-label="Siguiente foto"
        >
          <Image src={l.fotos[photo]} alt={l.nombre || l.fecha} fill sizes="340px" className="object-cover" />
        </button>
        {l.fotos.length > 1 ? (
          <div className="mt-2 flex justify-center gap-1.5">
            {l.fotos.map((_, i) => (
              <span key={i} className={cn("h-2 w-2", i === photo ? "bg-rose-dark" : "bg-ink-soft/30")} />
            ))}
          </div>
        ) : null}
        <figcaption className="mt-2 text-center text-ink">
          {l.nombre ? <span className="block text-xl leading-tight">{l.nombre}</span> : null}
          <span className={l.nombre ? "block text-sm text-ink-soft" : "block text-xl leading-tight"}>{l.fecha}</span>
          {l.frase ? <span className="mt-1 block text-base">{l.frase}</span> : null}
        </figcaption>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-cream text-xl text-ink"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </motion.figure>
    </motion.div>
  );
}
