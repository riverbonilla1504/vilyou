"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { dialogos } from "@/content/dialogos";
import { discover } from "@/lib/discoveries";
import { discoStore, isWaitingForTap, musicStore, resume, toggle } from "@/lib/music";
import { pop } from "@/lib/sound";
import { dedicateSong, say } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";
import { RecordDisc } from "./RecordDisc";

export type ThemeId = "carta" | "halloween" | "carnival" | "park" | "sunset" | "love";

type Theme = {
  /** Sky key colors, top to bottom. */
  sky: string[];
  far: string;
  mid: string;
  ground: string;
  stars: number;
  fireflies: number;
  firefly: string;
  hearts: number;
  celestial: "moon" | "sun" | "heart";
  /** Celestial position, in % of the viewport. */
  cx: number;
  cy: number;
  glow: string;
};

const themes: Record<ThemeId, Theme> = {
  carta: {
    sky: ["#0a0a28", "#13143d", "#1d1a52", "#2b2066", "#432877", "#6b3b88"],
    far: "#2a2160",
    mid: "#1c1646",
    ground: "#120f30",
    stars: 1,
    fireflies: 0.9,
    firefly: "#ffe9a3",
    hearts: 0.5,
    celestial: "moon",
    cx: 80,
    cy: 15,
    glow: "rgba(255, 240, 200, 0.35)",
  },
  halloween: {
    sky: ["#110720", "#1d0b36", "#2d104e", "#45175e", "#62205f", "#88315a"],
    far: "#2b1240",
    mid: "#1d0b2d",
    ground: "#13071c",
    stars: 0.9,
    fireflies: 1,
    firefly: "#ffb347",
    hearts: 0.2,
    celestial: "moon",
    cx: 76,
    cy: 18,
    glow: "rgba(255, 190, 120, 0.4)",
  },
  carnival: {
    sky: ["#141340", "#211f69", "#382a89", "#5c3398", "#913f9a", "#d0568f"],
    far: "#3a2470",
    mid: "#271650",
    ground: "#180d37",
    stars: 0.7,
    fireflies: 0.5,
    firefly: "#ffe066",
    hearts: 0.3,
    celestial: "moon",
    cx: 18,
    cy: 14,
    glow: "rgba(255, 210, 240, 0.35)",
  },
  park: {
    sky: ["#0b1d3c", "#122f57", "#1c4570", "#2e5f86", "#4b7e95", "#7aa49f"],
    far: "#20395a",
    mid: "#163838",
    ground: "#0f2a26",
    stars: 0.55,
    fireflies: 0.9,
    firefly: "#d6ff7a",
    hearts: 0.2,
    celestial: "moon",
    cx: 70,
    cy: 12,
    glow: "rgba(220, 255, 240, 0.3)",
  },
  sunset: {
    sky: ["#2a1446", "#56205e", "#8f2f62", "#cf4a5c", "#f3784e", "#ffb75a"],
    far: "#6b2a56",
    mid: "#3f1a41",
    ground: "#25102b",
    stars: 0.12,
    fireflies: 0,
    firefly: "#ffd27a",
    hearts: 0.35,
    celestial: "sun",
    cx: 50,
    cy: 52,
    glow: "rgba(255, 200, 100, 0.55)",
  },
  love: {
    sky: ["#23082d", "#3c0f44", "#5d1a5d", "#852a71", "#b34389", "#e86ca5"],
    far: "#5a1d5e",
    mid: "#3a1240",
    ground: "#250a2c",
    stars: 0.8,
    fireflies: 0.6,
    firefly: "#ffc2d9",
    hearts: 1,
    celestial: "heart",
    cx: 78,
    cy: 17,
    glow: "rgba(255, 150, 190, 0.45)",
  },
};

const themeIds = Object.keys(themes) as ThemeId[];

/* ---------- deterministic helpers (identical on server and client) ---------- */

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

/** A posterized, pixel-art style gradient. */
function bandedSky(keys: string[], bands = 18) {
  const stops: string[] = [];
  for (let i = 0; i < bands; i++) {
    const t = (i / (bands - 1)) * (keys.length - 1);
    const k = Math.min(Math.floor(t), keys.length - 2);
    const from = ((i / bands) * 100).toFixed(2);
    const to = (((i + 1) / bands) * 100).toFixed(2);
    stops.push(`${mix(keys[k], keys[k + 1], t - k)} ${from}% ${to}%`);
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

const skies = Object.fromEntries(themeIds.map((id) => [id, bandedSky(themes[id].sky)])) as Record<
  ThemeId,
  string
>;

const W = 1440;
const H = 900;
const q = (v: number) => Math.round(v / 8) * 8;

function hillY(x: number, seed: number, base: number, amp: number, freq: number) {
  return q(base + Math.sin(x * freq + seed) * amp + Math.sin(x * freq * 2.7 + seed * 3.1) * amp * 0.3);
}

function steppedHill(seed: number, base: number, amp: number, freq: number, step = 24) {
  let d = `M0 ${H}`;
  for (let x = 0; x < W; x += step) {
    const y = hillY(x, seed, base, amp, freq);
    d += ` L${x} ${y} L${x + step} ${y}`;
  }
  return `${d} L${W} ${H} Z`;
}

const farPath = steppedHill(1.3, 560, 42, 0.0042);
const midPath = steppedHill(4.1, 640, 30, 0.0061);
const groundPath = steppedHill(2.2, 742, 14, 0.009, 16);
const groundY = (x: number) => hillY(x, 2.2, 742, 14, 0.009);
const midY = (x: number) => hillY(x, 4.1, 640, 30, 0.0061);

const peaks = [
  { x: 180, h: 300 },
  { x: 470, h: 380 },
  { x: 760, h: 300 },
  { x: 1040, h: 420 },
  { x: 1330, h: 320 },
];

function mountainTop(x: number) {
  let top = H;
  for (const p of peaks) top = Math.min(top, 720 - (p.h - Math.abs(x - p.x) * 1.15));
  return q(top);
}

const mountainPath = (() => {
  let d = `M0 ${H}`;
  for (let x = 0; x < W; x += 16) {
    const y = mountainTop(x);
    d += ` L${x} ${y} L${x + 16} ${y}`;
  }
  return `${d} L${W} ${H} Z`;
})();

const snowPath = (() => {
  let d = "";
  for (let x = 0; x < W; x += 16) {
    const y = mountainTop(x);
    if (y < 400) d += `M${x} ${y}h16v${Math.min(32, 400 - y + 8)}h-16Z`;
  }
  return d;
})();

const stars = (() => {
  const r = rng(7);
  return Array.from({ length: 70 }, () => ({
    left: r() * 100,
    top: r() * 58,
    size: r() < 0.15 ? 4 : r() < 0.55 ? 3 : 2,
    delay: r() * 6,
    duration: 2.5 + r() * 4,
  }));
})();

const sparkles = (() => {
  const r = rng(21);
  return Array.from({ length: 7 }, () => ({
    left: 4 + r() * 92,
    top: 4 + r() * 40,
    delay: r() * 5,
  }));
})();

const fireflies = (() => {
  const r = rng(99);
  return Array.from({ length: 16 }, (_, i) => ({
    left: r() * 100,
    top: 55 + r() * 38,
    delay: r() * 8,
    duration: 7 + r() * 7,
    path: i % 3,
  }));
})();

const risingHearts = (() => {
  const r = rng(3);
  return Array.from({ length: 9 }, () => ({
    left: 3 + r() * 94,
    delay: r() * 18,
    duration: 14 + r() * 10,
    scale: 2 + Math.round(r() * 2),
  }));
})();

const confetti = (() => {
  const r = rng(55);
  const colors = ["#ff6b9d", "#ffd54f", "#ce93d8", "#6fe3a4", "#7fd6ff"];
  return Array.from({ length: 26 }, (_, i) => ({
    left: r() * 100,
    delay: r() * 10,
    duration: 8 + r() * 8,
    color: colors[i % colors.length],
  }));
})();

const gardenFlowers: { sprite: "tulip" | "lily"; palette?: Record<string, string>; lift: number }[] = [
  { sprite: "tulip", lift: 0 },
  { sprite: "lily", lift: 10 },
  { sprite: "tulip", palette: { R: "#ffd54f", L: "#fff1a8", D: "#e0a92a" }, lift: 4 },
  { sprite: "tulip", palette: { R: "#c58cff", L: "#ead4ff", D: "#9a5ee0" }, lift: 14 },
  { sprite: "lily", palette: { W: "#ffe3ef", L: "#ff9ec7", P: "#ff5d8f" }, lift: 4 },
  { sprite: "tulip", palette: { R: "#ffd54f", L: "#fff1a8", D: "#e0a92a" }, lift: 10 },
  { sprite: "tulip", lift: 0 },
];

const flagColors = ["#ff6b9d", "#ffd54f", "#7fd6ff", "#ce93d8", "#6fe3a4"];

/* ---------------------------------- scene ---------------------------------- */

export function PixelScene({
  themeId,
  scrollContainer,
  interactive = false,
}: {
  themeId: ThemeId;
  /** Scrollable element driving the parallax (defaults to the window). */
  scrollContainer?: React.RefObject<HTMLElement | null>;
  /** The moon, clouds, shooting star and tulips react to taps. */
  interactive?: boolean;
}) {
  const theme = themes[themeId];
  const { scrollYProgress } = useScroll(scrollContainer ? { container: scrollContainer } : undefined);
  const [rain, setRain] = useState<{ x: number; y: number; key: number }[]>([]);
  const [moonKick, setMoonKick] = useState(0);
  const [hop, setHop] = useState<{ i: number; key: number } | null>(null);
  const disco = discoStore.useValue();
  const showDisc = disco && theme.celestial === "moon";

  const heartRain = (e: React.MouseEvent) => {
    const drop = { x: e.clientX, y: e.clientY, key: e.timeStamp };
    setRain((r) => [...r.slice(-3), drop]);
  };
  const farY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const midYOffset = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const groundOffset = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const show = (...ids: ThemeId[]) => ({ opacity: ids.includes(themeId) ? 1 : 0 });

  return (
    <div
      aria-hidden="true"
      className={cn("scene fixed inset-0 -z-10 overflow-hidden", !interactive && "pointer-events-none")}
      style={
        {
          "--hill-far": theme.far,
          "--hill-mid": theme.mid,
          "--hill-ground": theme.ground,
          "--firefly": theme.firefly,
          "--glow": theme.glow,
        } as React.CSSProperties
      }
    >
      {themeIds.map((id) => (
        <div
          key={id}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
          style={{ background: skies[id], opacity: id === themeId ? 1 : 0 }}
        />
      ))}

      {/* stars */}
      <motion.div
        className="absolute inset-0 transition-opacity duration-[1400ms]"
        style={{ opacity: theme.stars, y: starsY }}
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="star-sparkle absolute"
            style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
          >
            <PixelSprite name="sparkle" scale={3} />
          </span>
        ))}
        {interactive ? (
          <button
            type="button"
            tabIndex={-1}
            className="shooting-star is-interactive"
            onClick={(e) => {
              pop();
              heartRain(e);
              discover("estrella-fugaz");
            }}
          />
        ) : (
          <span className="shooting-star" />
        )}
      </motion.div>

      {/* moon / sun / heart */}
      <div
        className="celestial absolute"
        style={{ left: `${theme.cx}%`, top: `${theme.cy}%` }}
      >
        <div className="celestial-glow" />
        {interactive ? (
          <button
            type="button"
            tabIndex={-1}
            className="absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
            aria-label={showDisc ? "Pausar o seguir la música" : "Luna"}
            onClick={(e) => {
              heartRain(e);
              discover("luna-pixel");
              if (theme.celestial !== "moon") {
                pop();
                setMoonKick((k) => k + 1);
              } else if (!disco) {
                // The very first tap: the moon becomes a record and the song starts.
                dedicateSong();
              } else if (musicStore.get().playing && (isWaitingForTap() || !musicStore.get().audible)) {
                resume();
              } else {
                toggle();
              }
            }}
          />
        ) : null}
        <AnimatePresence>
          {showDisc ? (
            <motion.div
              key="disc"
              className="absolute left-0 top-0"
              initial={{ scale: 0, rotate: -200, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 13, delay: 0.25 }}
            >
              <RecordDisc />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <motion.div
          key={moonKick}
          className="absolute inset-0"
          animate={moonKick ? { rotate: [0, -12, 10, -6, 0], scale: [1, 1.15, 1] } : undefined}
          transition={{ duration: 0.7 }}
        >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={showDisc ? { scale: 0, rotate: 260, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeIn" }}
        >
          <PixelSprite
            name="moon"
            scale={7}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000"
            style={{ opacity: theme.celestial === "moon" ? 1 : 0 }}
          />
        </motion.div>
        <PixelSprite
          name="moon"
          scale={11}
          palette={{ K: "#ff9a3c", M: "#ffd36a", C: "#ffe28e", S: "#ffb347" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000"
          style={{ opacity: theme.celestial === "sun" ? 1 : 0 }}
        />
        <PixelSprite
          name="heart"
          scale={7}
          palette={{ K: "#ffd6e4", R: "#ffb3cb", W: "#fff3f7", D: "#ff8fb3" }}
          className="celestial-heart absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000"
          style={{ opacity: theme.celestial === "heart" ? 1 : 0 }}
        />
        </motion.div>
      </div>

      {/* clouds */}
      <div className="pointer-events-none absolute inset-x-0 top-[6%] h-[40%] opacity-30">
        {[
          { scale: 6, top: "8%", duration: "140s", delay: "0s" },
          { scale: 4, top: "38%", duration: "110s", delay: "-60s" },
          { scale: 5, top: "62%", duration: "170s", delay: "-30s" },
        ].map((c, i) => (
          <span key={i} className="cloud" style={{ top: c.top, animationDuration: c.duration, animationDelay: c.delay }}>
            {interactive ? (
              <button
                type="button"
                tabIndex={-1}
                className="pointer-events-auto block"
                onClick={(e) => {
                  pop();
                  heartRain(e);
                  discover("nube");
                }}
              >
                <PixelSprite name="cloud" scale={c.scale} />
              </button>
            ) : (
              <PixelSprite name="cloud" scale={c.scale} />
            )}
          </span>
        ))}
      </div>

      {/* carnival bunting */}
      <div className="absolute inset-x-0 top-0 transition-opacity duration-1000" style={show("carnival")}>
        <svg
          className="h-[120px] w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
        >
          {[0, 1].map((row) => {
            const y0 = 18 + row * 46;
            return (
              <g key={row}>
                {Array.from({ length: 24 }).map((_, i) => {
                  const x = i * 60 + (row ? 30 : 0);
                  const sag = Math.round(Math.sin((x / 1440) * Math.PI) * 26);
                  const y = y0 + sag;
                  return (
                    <g key={i}>
                      <rect x={x} y={y} width={60} height={3} fill="#2a1840" />
                      <path
                        d={`M${x + 12} ${y + 3} h28 v6 h-4 v6 h-4 v6 h-4 v6 h-4 v-6 h-4 v-6 h-4 v-6 h-4 Z`}
                        fill={flagColors[(i + row * 2) % flagColors.length]}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
        {confetti.map((c, i) => (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${c.left}%`,
              background: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>

      {/* bats & birds */}
      <div className="absolute inset-0 transition-opacity duration-1000" style={show("halloween")}>
        <PixelSprite name="bat" scale={4} className="flyer" style={{ top: "22%", animationDuration: "19s" }} />
        <PixelSprite
          name="bat"
          scale={3}
          className="flyer"
          style={{ top: "34%", animationDuration: "26s", animationDelay: "-9s" }}
        />
        <PixelSprite
          name="bat"
          scale={3}
          className="flyer"
          style={{ top: "14%", animationDuration: "31s", animationDelay: "-20s" }}
        />
      </div>
      <div className="absolute inset-0 transition-opacity duration-1000" style={show("sunset")}>
        {[0, 1, 2, 3].map((i) => (
          <PixelSprite
            key={i}
            name="bird"
            scale={4}
            className="flyer"
            style={{
              top: `${24 + (i % 2) * 7 + i * 2}%`,
              animationDuration: `${24 + i * 3}s`,
              animationDelay: `${-i * 2.2}s`,
            }}
          />
        ))}
      </div>

      {/* hills */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
      >
        <motion.g style={{ y: farY }}>
          <g className="transition-opacity duration-1000" style={show("park")}>
            <path d={mountainPath} fill="#253f63" />
            <path d={snowPath} fill="#e8f0ff" opacity={0.85} />
          </g>
          <path d={farPath} className="hill-far" />
        </motion.g>

        <motion.g style={{ y: midYOffset }}>
          <path d={midPath} className="hill-mid" />
          <g className="transition-opacity duration-1000" style={show("park", "carta")}>
            {[90, 150, 1210, 1290, 1350].map((x, i) => (
              <g key={x} transform={`translate(${x} ${midY(x) - (i % 2 ? 56 : 70)})`}>
                <PixelSprite name="pine" scale={i % 2 ? 4 : 5} />
              </g>
            ))}
          </g>
        </motion.g>

        <motion.g style={{ y: groundOffset }}>
          <path d={groundPath} className="hill-ground" />

          <g className="transition-opacity duration-1000" style={show("halloween")}>
            {[260, 420, 1060, 1180].map((x, i) => (
              <g key={x} transform={`translate(${x} ${groundY(x) - (i % 2 ? 30 : 40)})`}>
                <PixelSprite name="pumpkin" scale={i % 2 ? 3 : 4} />
              </g>
            ))}
          </g>

        </motion.g>
      </svg>

      {/* A row of 7 flowers along the ground: always on screen, each one tappable. */}
      <motion.div
        className="absolute inset-x-0 bottom-[11%] flex items-end justify-around px-3 transition-opacity duration-1000 sm:px-[12%]"
        style={{ ...show("love", "carta"), y: groundOffset }}
      >
        {gardenFlowers.map((f, i) => {
          const visible = themeId === "love" || themeId === "carta";
          const art = (
            <motion.span
              key={hop?.i === i ? hop.key : "still"}
              className="block"
              animate={hop?.i === i ? { y: [0, -18, 0], rotate: [0, -10, 8, 0], scale: [1, 1.2, 1] } : undefined}
              transition={{ duration: 0.55 }}
            >
              <PixelSprite name={f.sprite} scale={3} palette={f.palette} />
            </motion.span>
          );
          return interactive && visible ? (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-label="Flor"
              className="garden-flower block p-1"
              style={{ marginBottom: f.lift }}
              onClick={(e) => {
                pop();
                setHop((h) => ({ i, key: (h?.key ?? 0) + 1 }));
                heartRain(e);
                discover("tulipan-pixel");
                say(f.sprite === "lily" ? dialogos.lirio : dialogos.tulipan);
              }}
            >
              {art}
            </button>
          ) : (
            <span key={i} className="block p-1" style={{ marginBottom: f.lift }}>
              {art}
            </span>
          );
        })}
      </motion.div>

      {/* fireflies */}
      <div className="absolute inset-0 transition-opacity duration-[1400ms]" style={{ opacity: theme.fireflies }}>
        {fireflies.map((f, i) => (
          <span
            key={i}
            className={`firefly firefly-${f.path}`}
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
            }}
          />
        ))}
      </div>

      {/* rising hearts */}
      <div className="absolute inset-0 transition-opacity duration-[1400ms]" style={{ opacity: theme.hearts }}>
        {risingHearts.map((h, i) => (
          <span
            key={i}
            className="rise"
            style={{ left: `${h.left}%`, animationDelay: `${h.delay}s`, animationDuration: `${h.duration}s` }}
          >
            <span className="sway">
              <PixelSprite name="heartSmall" scale={h.scale} />
            </span>
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(8,4,20,0.55)_100%)]" />

      <AnimatePresence>
        {rain.map((d) => (
          <motion.span key={d.key} className="pointer-events-none fixed" style={{ left: d.x, top: d.y }} exit={{ opacity: 0 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <motion.span
                key={i}
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                animate={{ x: (i - 3) * 22, y: [0, -30, 140 + (i % 3) * 30], opacity: [1, 1, 0], scale: 1 }}
                transition={{ duration: 1.6, delay: i * 0.05, ease: "easeOut" }}
                onAnimationComplete={() => i === 6 && setRain((r) => r.filter((x) => x.key !== d.key))}
              >
                <PixelSprite name="heartSmall" scale={3} />
              </motion.span>
            ))}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
