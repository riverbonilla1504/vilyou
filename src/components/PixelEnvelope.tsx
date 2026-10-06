"use client";

import { motion } from "framer-motion";
import { PixelSprite } from "./pixel/PixelSprite";

type Rect = { x: number; y: number; w: number; h: number; fill: string };

const W = 31;
const H = 22;
const C = {
  outline: "#4a2410",
  body: "#fbe3b0",
  fold: "#d9a868",
  shade: "#efcd8f",
  flap: "#ffedc9",
  flapInside: "#e7bd84",
  paper: "#fff8e6",
  ink: "#c9a37a",
  rose: "#ff6f9a",
};

/** A triangle drawn row by row, so the diagonals step like pixel art. */
function steppedTriangle(rows: number, apexInset: number, rowY: (k: number) => number, fill: string, inset = 0) {
  const rects: Rect[] = [];
  for (let k = 0; k < rows; k++) {
    const i = Math.round((k * apexInset) / (rows - 1)) + inset;
    const w = W - i * 2;
    if (w > 0) rects.push({ x: i, y: rowY(k), w, h: 1, fill });
  }
  return rects;
}

const closedFlap = [
  ...steppedTriangle(13, 14, (k) => k, C.outline),
  ...steppedTriangle(12, 13, (k) => k, C.flap, 1).slice(1),
];

const openFlap = [
  ...steppedTriangle(12, 14, (k) => -1 - k, C.outline),
  ...steppedTriangle(11, 13, (k) => -1 - k, C.flapInside, 1),
];

const foldLines: Rect[] = Array.from({ length: 14 }, (_, i) => {
  const y = Math.round(20 - (i * 8) / 13);
  return [
    { x: 1 + i, y, w: 1, h: 1, fill: C.fold },
    { x: W - 2 - i, y, w: 1, h: 1, fill: C.fold },
  ];
}).flat();

function Rects({ rects }: { rects: Rect[] }) {
  return (
    <>
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
      ))}
    </>
  );
}

const pixelSteps = (n: number) => (t: number) => Math.min(1, Math.ceil(t * n) / n);

export function PixelEnvelope({ opening, className }: { opening: boolean; className?: string }) {
  const state = opening ? "open" : "closed";

  return (
    <svg
      viewBox={`0 -13 ${W} ${H + 13}`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      overflow="visible"
    >
      {/* flap, open (behind the letter) */}
      <motion.g
        initial={false}
        animate={state}
        variants={{
          closed: { scaleY: 0 },
          open: { scaleY: 1, transition: { delay: 0.62, duration: 0.18, ease: pixelSteps(3) } },
        }}
        style={{ originY: 1 }}
      >
        <Rects rects={openFlap} />
      </motion.g>

      {/* the letter inside */}
      <motion.g
        initial={false}
        animate={state}
        variants={{
          closed: { y: 0 },
          open: { y: -12, transition: { delay: 0.85, duration: 0.5, ease: pixelSteps(6) } },
        }}
      >
        <rect x={3} y={3} width={25} height={18} fill={C.outline} />
        <rect x={4} y={4} width={23} height={16} fill={C.paper} />
        <rect x={7} y={6} width={12} height={1} fill={C.ink} />
        <rect x={7} y={8} width={17} height={1} fill={C.ink} />
        <rect x={7} y={10} width={15} height={1} fill={C.ink} />
        <rect x={22} y={5} width={2} height={1} fill={C.rose} />
        <rect x={21} y={6} width={4} height={1} fill={C.rose} />
        <rect x={22} y={7} width={2} height={1} fill={C.rose} />
      </motion.g>

      {/* envelope body */}
      <rect x={0} y={0} width={W} height={H} fill={C.outline} />
      <rect x={1} y={1} width={W - 2} height={H - 2} fill={C.body} />
      <rect x={1} y={H - 2} width={W - 2} height={1} fill={C.shade} />
      <Rects rects={foldLines} />

      {/* flap, closed */}
      <motion.g
        initial={false}
        animate={state}
        variants={{
          closed: { scaleY: 1 },
          open: { scaleY: 0, transition: { delay: 0.44, duration: 0.18, ease: pixelSteps(3) } },
        }}
        style={{ originY: 0 }}
      >
        <Rects rects={closedFlap} />
      </motion.g>

      {/* heart seal */}
      <motion.g
        initial={false}
        animate={state}
        variants={{
          closed: { opacity: 1, scale: 1, y: 0 },
          open: { opacity: 0, scale: 1.8, y: -4, transition: { delay: 0.22, duration: 0.3 } },
        }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <g transform="translate(12 8)">
          <PixelSprite name="heartSmall" scale={1} palette={{ R: "#e0405f", W: "#ffb3c6" }} />
        </g>
      </motion.g>
    </svg>
  );
}
