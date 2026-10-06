"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { config, localTime } from "@/content/config";
import { jardin } from "@/content/lugares";
import { pad, splitDuration, useNow } from "@/lib/clock";
import { discover } from "@/lib/discoveries";
import { pop } from "@/lib/sound";
import { useTypewriter } from "@/lib/useTypewriter";
import { spriteCanvas } from "../pixel/canvas";

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** The classic parametric heart, normalized: x in [-1, 1], y down in about [-0.73, 1.06]. */
const HEART = Array.from({ length: 160 }, (_, i) => {
  const t = (i / 160) * Math.PI * 2;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [x / 16, -y / 16] as const;
});
const HEART_TOP = Math.min(...HEART.map((p) => p[1]));
const HEART_BOTTOM = Math.max(...HEART.map((p) => p[1]));

/** Point-in-polygon test against the heart, optionally shrunk by `k`. */
function inHeart(x: number, y: number, k = 1) {
  let inside = false;
  for (let i = 0, j = HEART.length - 1; i < HEART.length; j = i++) {
    const [xi, yi] = HEART[i];
    const [xj, yj] = HEART[j];
    const ax = xi * k;
    const ay = yi * k;
    const bx = xj * k;
    const by = yj * k;
    if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) inside = !inside;
  }
  return inside;
}

/** A tree that grows from a seed and blooms into a heart of tulips and lilies. */
function GardenCanvas({ onBloomed }: { onBloomed: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef(onBloomed);
  useEffect(() => {
    cb.current = onBloomed;
  });

  useEffect(() => {
    const canvas = ref.current!;
    const g = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const art = [
      spriteCanvas("tulip", 2),
      spriteCanvas("tulip", 2, { R: "#ffd54f", L: "#fff1a8", D: "#e0a92a" }),
      spriteCanvas("tulip", 2, { R: "#c58cff", L: "#ead4ff", D: "#9a5ee0" }),
      spriteCanvas("lily", 2),
      spriteCanvas("lily", 2, { W: "#ffe3ef", L: "#ff9ec7", P: "#ff5d8f" }),
      spriteCanvas("heartSmall", 2),
    ];
    const seedArt = spriteCanvas("heartSmall", 3, { R: "#8a5a2b", W: "#c08850" });
    const petalArt = [spriteCanvas("heartSmall", 2, { R: "#ffb3cb", W: "#fff0f5" }), spriteCanvas("heartSmall", 2, { R: "#fff6fb", W: "#ffffff" })];

    type Seg = { x1: number; y1: number; x2: number; y2: number; width: number; start: number; end: number };
    type Flower = { x: number; y: number; img: HTMLCanvasElement; born: number; scale: number; bounce: number };
    type Petal = { x: number; y: number; vy: number; phase: number; img: HTMLCanvasElement; alive: boolean };

    let segs: Seg[] = [];
    let flowers: Flower[] = [];
    let groundY = 0;
    let cx = 0;
    const petals: Petal[] = [];

    const layout = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.imageSmoothingEnabled = false;
      cx = w / 2;
      groundY = h - 28;

      // The crown is a heart as big as the space allows, with a visible trunk below.
      const size = Math.max(70, Math.min(w * 0.4, (groundY - 100) / (HEART_BOTTOM - HEART_TOP), 230));
      const hy = 20 - HEART_TOP * size;
      const toLocal = (x: number, y: number) => [(x - cx) / size, (y - hy) / size] as const;
      const insideCrown = (x: number, y: number, k: number) => inHeart(...toLocal(x, y), k);

      const r = rng(77);

      // Branches: they always end inside the heart so nothing pokes out.
      segs = [];
      const trunkTop = hy + size * 0.42;
      segs.push({ x1: cx, y1: groundY, x2: cx, y2: trunkTop, width: 12, start: 1.0, end: 1.6 });
      const grow = (x: number, y: number, angle: number, len: number, depth: number, t0: number) => {
        let l = len;
        let x2 = x + Math.cos(angle) * l;
        let y2 = y - Math.sin(angle) * l;
        for (let i = 0; i < 5 && !insideCrown(x2, y2, 0.82); i++) {
          l *= 0.72;
          x2 = x + Math.cos(angle) * l;
          y2 = y - Math.sin(angle) * l;
        }
        if (!insideCrown(x2, y2, 0.82) || l < 6) return;
        const dur = 0.32;
        segs.push({ x1: x, y1: y, x2, y2, width: Math.max(2, 9 - depth * 2), start: t0, end: t0 + dur });
        if (depth >= 4) return;
        for (const side of [-1, 1]) {
          const spread = side * (0.32 + r() * 0.22);
          grow(x2, y2, angle + spread, l * (0.66 + r() * 0.1), depth + 1, t0 + dur);
        }
      };
      for (const a of [-0.62, -0.22, 0.22, 0.62]) grow(cx, trunkTop, Math.PI / 2 + a, size * 0.62, 1, 1.6);

      // Blossoms: a crisp outline plus a mirrored, jittered fill.
      flowers = [];
      // Spacing follows the flower size, not the crown size, so the heart always looks full.
      const step = Math.min(19, Math.max(15, size / 9));
      const pick = () => art[Math.floor(r() * art.length)];
      const born = (x: number, y: number) => {
        const d = Math.hypot(x - cx, y - trunkTop) / (size * 1.3);
        return 2.6 + Math.min(1, d) * 2.2 + r() * 0.35;
      };
      const add = (x: number, y: number) =>
        flowers.push({ x, y, img: pick(), born: born(x, y), scale: 0.82 + r() * 0.22, bounce: -10 });

      const perimeter = HEART.reduce((sum, p, i) => {
        const q = HEART[(i + 1) % HEART.length];
        return sum + Math.hypot(q[0] - p[0], q[1] - p[1]) * size;
      }, 0);
      const ring = Math.round(perimeter / (step * 0.95));
      for (let i = 0; i < ring; i++) {
        const [px, py] = HEART[Math.floor((i / ring) * HEART.length)];
        add(cx + px * size * 0.93, hy + py * size * 0.93);
      }
      for (let gy = hy + HEART_TOP * size; gy <= hy + HEART_BOTTOM * size; gy += step * 0.82) {
        for (let gx = 0; gx <= size; gx += step) {
          const jx = (r() - 0.5) * step * 0.45;
          const jy = (r() - 0.5) * step * 0.45;
          const x = gx + jx;
          const y = gy + jy;
          if (!insideCrown(cx + x, y, 0.8)) continue;
          add(cx + x, y);
          if (x > step * 0.35) add(cx - x, y + (r() - 0.5) * 3);
        }
      }
      flowers.sort((a, b) => a.y - b.y);
    };
    layout();

    let bloomed = false;
    let raf = 0;
    const start = performance.now();
    let nextPetal = 5;
    let last = start;

    const draw = (now: number) => {
      // The first rAF timestamp can be slightly earlier than `start`.
      const t = Math.max(0, (now - start) / 1000);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      g.clearRect(0, 0, w, h);

      // ground
      g.fillStyle = "#7cc97a";
      g.fillRect(0, groundY, w, 6);
      g.fillStyle = "#5aa65d";
      g.fillRect(0, groundY + 6, w, h - groundY);
      for (let x = 0; x < w; x += 12) g.fillRect(x, groundY - 3, 4, 3);

      // the seed falling
      if (t < 1.05) {
        const k = Math.min(1, t / 0.9);
        const y = 20 + (groundY - 30) * k * k;
        g.drawImage(seedArt, cx - seedArt.width / 2, y - seedArt.height / 2);
      }

      // branches
      g.strokeStyle = "#7a4a2a";
      g.lineCap = "square";
      for (const s of segs) {
        if (t < s.start) continue;
        const k = Math.min(1, (t - s.start) / (s.end - s.start));
        g.lineWidth = s.width;
        g.beginPath();
        g.moveTo(Math.round(s.x1), Math.round(s.y1));
        g.lineTo(Math.round(s.x1 + (s.x2 - s.x1) * k), Math.round(s.y1 + (s.y2 - s.y1) * k));
        g.stroke();
      }

      // blossoms
      for (const f of flowers) {
        if (t < f.born) continue;
        const k = Math.min(1, (t - f.born) / 0.35);
        const pulse = Math.max(0, 1 - (t - f.bounce) / 0.5);
        const s = f.scale * (k < 1 ? 1.2 * Math.sin(k * Math.PI * 0.6) / Math.sin(Math.PI * 0.6) : 1) * (1 + pulse * 0.6);
        const iw = f.img.width * s;
        const ih = f.img.height * s;
        const sway = k >= 1 ? Math.sin(t * 1.3 + f.y * 0.05) * 1.2 : 0;
        g.drawImage(f.img, Math.round(f.x - iw / 2 + sway), Math.round(f.y - ih / 2), iw, ih);
      }

      if (!bloomed && t > 5.4) {
        bloomed = true;
        cb.current();
      }

      // falling petals
      if (t > 5) {
        nextPetal -= dt;
        if (nextPetal <= 0 && flowers.length) {
          nextPetal = 0.35 + Math.random() * 0.5;
          const f = flowers[Math.floor(Math.random() * flowers.length)];
          petals.push({
            x: f.x,
            y: f.y,
            vy: 26 + Math.random() * 30,
            phase: Math.random() * 6,
            img: petalArt[Math.floor(Math.random() * 2)],
            alive: true,
          });
        }
      }
      for (const p of petals) {
        if (!p.alive) continue;
        p.y += p.vy * dt;
        const x = p.x + Math.sin(t * 2 + p.phase) * 18;
        if (p.y > groundY) p.alive = false;
        g.globalAlpha = 0.9;
        g.drawImage(p.img, Math.round(x - 7), Math.round(p.y - 6));
        g.globalAlpha = 1;
      }
      for (let i = petals.length - 1; i >= 0; i--) if (!petals[i].alive) petals.splice(i, 1);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onTap = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const t = (performance.now() - start) / 1000;
      for (const p of petals) {
        const px = p.x + Math.sin(t * 2 + p.phase) * 18;
        if (p.alive && Math.hypot(px - x, p.y - y) < 26) {
          p.alive = false;
          pop();
          discover("petalo");
          return;
        }
      }
      let best: Flower | null = null;
      let bestD = 22;
      for (const f of flowers) {
        if (t < f.born) continue;
        const d = Math.hypot(f.x - x, f.y - y);
        if (d < bestD) {
          bestD = d;
          best = f;
        }
      }
      if (best) {
        best.bounce = t;
        pop();
        discover("lirio");
      }
    };
    canvas.addEventListener("pointerdown", onTap);
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onTap);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full touch-manipulation" aria-label="Árbol de tulipanes y lirios" />;
}

const units = ["días", "horas", "minutos", "segundos"] as const;

export function GardenPlace() {
  const [started, setStarted] = useState(false);

  const text = jardin.lineas.join("\n");
  const { shown } = useTypewriter(text.length, { active: started, cps: 26 });

  useEffect(() => {
    const t = window.setTimeout(() => setStarted(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="garden absolute inset-0 flex flex-col">
      <div className="garden-text relative z-10 px-5 text-ink">
        <p className="sr-only">{text}</p>
        <div aria-hidden="true" className="min-h-[7.5em] whitespace-pre-line text-[17px] leading-snug sm:text-lg">
          {text.slice(0, shown)}
          <span className="opacity-0">{text.slice(shown)}</span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <GardenCanvas onBloomed={() => discover("arbol")} />
      </div>

      <SinceCounter />
    </div>
  );
}

function SinceCounter() {
  const now = useNow();
  const since = now ? now - localTime(config.nosConocimos) : 0;
  const { dias, horas, minutos, segundos } = splitDuration(since);
  const [totalMode, setTotalMode] = useState(-1);
  const totals = {
    días: Math.floor(since / 86_400_000),
    horas: Math.floor(since / 3_600_000),
    minutos: Math.floor(since / 60_000),
    segundos: Math.floor(since / 1000),
  };

  return (
      <button
        type="button"
        onClick={() => {
          pop();
          discover("contador");
          setTotalMode((m) => (m + 1) % units.length);
        }}
        className="garden-counter frame-wood mx-auto mb-3 w-[min(94vw,420px)] px-3 py-2 text-center text-ink"
      >
        <div className="text-sm text-ink-soft">{jardin.contador}</div>
        <AnimatePresence mode="wait" initial={false}>
          {totalMode < 0 ? (
            <motion.div
              key="split"
              className="mt-1 flex items-start justify-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box v={String(dias)} l="días" />
              <Box v={pad(horas)} l="horas" />
              <Box v={pad(minutos)} l="min" />
              <Box v={pad(segundos)} l="seg" />
            </motion.div>
          ) : (
            <motion.div
              key={units[totalMode]}
              className="mt-1 font-press text-lg text-rose-dark sm:text-xl"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {totals[units[totalMode]].toLocaleString("es-CO")}
              <div className="mt-1 font-pixel text-sm text-ink-soft">{units[totalMode]} contigo ♥</div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-1 text-[11px] text-ink-soft/80">toca para verlo de otra forma</div>
      </button>
  );
}

function Box({ v, l }: { v: string; l: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="slot grid h-11 min-w-11 place-items-center px-1.5 font-press text-base">{v}</div>
      <span className="mt-0.5 text-[11px] text-ink-soft">{l}</span>
    </div>
  );
}
