import { useEffect, useRef } from "react";

/**
 * Turns an element like a record on a turntable: it speeds up and winds down
 * smoothly when `isSpinning()` changes. Returns a `flick(direction)` that gives
 * it a fast spin (for skipping songs).
 */
export function useRecordSpin(ref: React.RefObject<HTMLElement | null>, isSpinning: () => boolean, degPerSec = 200) {
  const spinning = useRef(isSpinning);
  const impulse = useRef(0);

  useEffect(() => {
    spinning.current = isSpinning;
  });

  useEffect(() => {
    let angle = 0;
    let speed = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      speed += impulse.current;
      impulse.current = 0;
      // Ease toward full speed (or a stop): ~1.5s to spin up, ~2s to wind down.
      const target = spinning.current() ? 1 : 0;
      const rate = Math.abs(speed) > Math.abs(target) ? 1.6 : 2.2;
      speed += (target - speed) * (1 - Math.exp(-dt * rate));
      angle = (angle + speed * degPerSec * dt) % 360;
      if (ref.current) ref.current.style.transform = `rotate(${angle}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, degPerSec]);

  return (direction: 1 | -1) => {
    impulse.current += direction * 7;
  };
}
