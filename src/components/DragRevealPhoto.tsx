"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PhotoFace } from "./PhotoFrame";
import { PixelSprite } from "./pixel/PixelSprite";

/** A framed photo that slides aside to reveal a hidden secret behind it. */
export function DragRevealPhoto({
  src,
  alt,
  onRevealEgg,
}: {
  src?: string;
  alt: string;
  onRevealEgg: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const threshold = 90;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const reveal = () => {
    if (revealed) {
      onRevealEgg();
      return;
    }
    setRevealed(true);
    timer.current = window.setTimeout(onRevealEgg, 450);
  };

  return (
    <div className="photo-frame frame-wood relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2a1b12]">
        <button
          type="button"
          onClick={reveal}
          className="wallpaper absolute inset-0 flex items-center justify-start pl-[10%]"
          aria-label="Descubrir el secreto escondido detrás de la foto"
        >
          <span className="flex flex-col items-center gap-2">
            <span className="speech px-2 py-0.5 text-sm text-ink">¡Miau!</span>
            <PixelSprite name="cat" scale={4} className="anim-flota" />
          </span>
        </button>

        <motion.div
          drag={revealed ? false : "x"}
          dragConstraints={{ left: 0, right: 180 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.x > threshold) reveal();
          }}
          animate={revealed ? { x: "62%", rotate: 4 } : { x: 0, rotate: 0 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 26 }}
          className="absolute inset-0 cursor-grab touch-pan-y bg-[#1b1240] shadow-[6px_0_0_rgba(20,8,24,0.45)] active:cursor-grabbing"
        >
          <PhotoFace src={src} alt={alt} />
          {!revealed ? (
            <span className="drag-hint pointer-events-none absolute left-3 top-3 px-2 py-1 text-sm text-ink">
              Arrástrame ▸
            </span>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
