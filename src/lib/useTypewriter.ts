import { useCallback, useEffect, useState } from "react";
import { blip } from "./sound";

/**
 * Reveals `total` characters one by one, Stardew dialogue style.
 * Call `skip()` to show everything at once.
 */
export function useTypewriter(
  total: number,
  { active = true, cps = 48, sound = true, startDone = false } = {},
) {
  const [count, setCount] = useState(0);
  const [skipped, setSkipped] = useState(startDone);

  const shown = skipped ? total : Math.min(count, total);
  const done = shown >= total;

  useEffect(() => {
    if (!active || done) return;
    let tick = 0;
    const id = window.setInterval(() => {
      setCount((c) => c + 1);
      if (sound && tick++ % 3 === 0) blip();
    }, 1000 / cps);
    return () => window.clearInterval(id);
  }, [active, done, cps, sound]);

  const skip = useCallback(() => setSkipped(true), []);

  return { shown, done, skip };
}
