"use client";

import { useEffect, useRef, useState } from "react";
import { PixelSprite } from "./pixel/PixelSprite";

/** Little hearts and sparkles pop wherever she taps, so every touch feels alive. */
export function TapBursts({ onTap }: { onTap?: () => void }) {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);
  const cb = useRef(onTap);

  useEffect(() => {
    cb.current = onTap;
  });

  useEffect(() => {
    const timers = new Set<number>();
    const onDown = (e: PointerEvent) => {
      const id = ++nextId.current;
      setBursts((b) => [...b.slice(-6), { id, x: e.clientX, y: e.clientY }]);
      const t = window.setTimeout(() => {
        setBursts((b) => b.filter((x) => x.id !== id));
        timers.delete(t);
      }, 900);
      timers.add(t);
      cb.current?.();
    };
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      {bursts.map((b) => (
        <span key={b.id} className="tap-burst" style={{ left: b.x, top: b.y }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="tap-bit" style={{ "--a": `${i * 60 + 15}deg` } as React.CSSProperties}>
              <PixelSprite
                name={i % 2 ? "sparkle" : "heartSmall"}
                scale={2}
                palette={i % 3 === 2 ? { R: "#c58cff", W: "#efe2ff" } : undefined}
              />
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
