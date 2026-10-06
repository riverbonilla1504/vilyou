"use client";

import { PixelSprite } from "./pixel/PixelSprite";

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const pieces = (() => {
  const r = rng(77);
  const palettes = [
    undefined,
    { R: "#ffd54f", W: "#fff6cf" },
    { R: "#c58cff", W: "#efe2ff" },
    { R: "#7fd6ff", W: "#e3f7ff" },
  ];
  return Array.from({ length: 44 }, (_, i) => ({
    left: r() * 100,
    delay: r() * 1.6,
    duration: 2.8 + r() * 2.4,
    scale: 2 + Math.round(r() * 3),
    spin: r() < 0.5 ? -1 : 1,
    palette: palettes[i % palettes.length],
  }));
})();

/** A one-shot shower of pixel hearts. Remount it (new key) to replay. */
export function HeartConfetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="heart-confetti"
          style={
            {
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--spin": p.spin,
            } as React.CSSProperties
          }
        >
          <PixelSprite name="heartSmall" scale={p.scale} palette={p.palette} />
        </span>
      ))}
    </div>
  );
}
