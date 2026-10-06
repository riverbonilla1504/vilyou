"use client";

import { useEffect, useRef } from "react";
import { spriteCanvas } from "./pixel/canvas";

/**
 * Tulips and lilies bloom from the center until they cover the screen,
 * then everything dissolves into the next scene.
 */
export function BloomTransition({ onCovered, onDone }: { onCovered: () => void; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onCovered, onDone });

  useEffect(() => {
    callbacks.current = { onCovered, onDone };
  });

  useEffect(() => {
    const canvas = ref.current!;
    const g = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    g.scale(dpr, dpr);
    g.imageSmoothingEnabled = false;

    const art = [
      spriteCanvas("tulip", 6),
      spriteCanvas("tulip", 6, { R: "#ffd54f", L: "#fff1a8", D: "#e0a92a" }),
      spriteCanvas("tulip", 6, { R: "#c58cff", L: "#ead4ff", D: "#9a5ee0" }),
      spriteCanvas("lily", 6),
      spriteCanvas("lily", 6, { W: "#ffe3ef", L: "#ff9ec7", P: "#ff5d8f" }),
      spriteCanvas("heartSmall", 8),
    ];

    const maxR = Math.hypot(w, h) / 2 + 60;
    const count = Math.round(Math.min(220, (w * h) / 2600));
    let seed = 11;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const flowers = Array.from({ length: count }, (_, i) => {
      const a = i * 2.39996;
      const r = Math.sqrt(i / count) * maxR;
      return {
        x: w / 2 + Math.cos(a) * r,
        y: h / 2 + Math.sin(a) * r,
        delay: (i / count) * 0.95,
        size: 0.55 + rnd() * 0.6,
        rot: (rnd() - 0.5) * 0.7,
        img: art[i % art.length],
      };
    });

    const backOut = (t: number) => {
      const c1 = 1.7;
      return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    let raf = 0;
    let covered = false;
    const start = performance.now();
    const COVER = 1.45;
    const HOLD = 0.35;
    const FADE = 0.75;

    const frame = (now: number) => {
      // The first rAF timestamp can be slightly earlier than `start`.
      const t = Math.max(0, (now - start) / 1000);
      g.clearRect(0, 0, w, h);

      const fade = Math.min(1, Math.max(0, (t - COVER - HOLD) / FADE));
      canvas.style.opacity = String(1 - fade);
      const zoom = 1 + fade * 0.6;

      const bgR = Math.min(1, t / 1.25) * maxR;
      g.fillStyle = "#ffeef5";
      g.beginPath();
      g.arc(w / 2, h / 2, bgR, 0, Math.PI * 2);
      g.fill();

      for (const f of flowers) {
        const p = Math.min(1, Math.max(0, (t - f.delay) / 0.5));
        if (p <= 0) continue;
        const s = backOut(p) * f.size * zoom;
        g.save();
        g.translate(w / 2 + (f.x - w / 2) * zoom, h / 2 + (f.y - h / 2) * zoom);
        g.rotate(f.rot * (1 - p * 0.5));
        g.drawImage(f.img, (-f.img.width * s) / 2, (-f.img.height * s) / 2, f.img.width * s, f.img.height * s);
        g.restore();
      }

      if (!covered && t >= COVER) {
        covered = true;
        callbacks.current.onCovered();
      }
      if (t >= COVER + HOLD + FADE) {
        callbacks.current.onDone();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] h-full w-full" />;
}
