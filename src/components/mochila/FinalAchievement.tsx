"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { TOTAL } from "@/content/descubrimientos";
import { logroFinal } from "@/content/logroFinal";
import { discoveredStore } from "@/lib/discoveries";
import { logroVistoStore, mochilaStore } from "@/lib/mochila";
import { hold } from "@/lib/music";
import { TOTAL_CANCIONES, useSongs } from "@/lib/songs";
import { fanfare, pop } from "@/lib/sound";
import { PixelSprite } from "../pixel/PixelSprite";

/** Every cosita and every song. */
export function useEverythingFound() {
  const cositas = discoveredStore.useValue().length;
  const { count } = useSongs();
  return { done: cositas >= TOTAL && count >= TOTAL_CANCIONES, cositas, canciones: count };
}

/** Opens the achievement by itself the first time she completes everything. */
export function FinalAchievementWatcher() {
  const { done } = useEverythingFound();
  const seen = logroVistoStore.useValue();
  useEffect(() => {
    if (!done || seen) return;
    logroVistoStore.set(true);
    const t = window.setTimeout(() => mochilaStore.set("logro"), 1500);
    return () => window.clearTimeout(t);
  }, [done, seen]);
  return null;
}

/** "¡Felicidades!" with confetti and River's voice note. */
export function FinalAchievement({ inline = false }: { inline?: boolean }) {
  const { done, cositas, canciones } = useEverythingFound();
  const [hasAudio, setHasAudio] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const release = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!done) return;
    fanfare();
    let alive = true;
    fetch(logroFinal.audio, { method: "HEAD" })
      .then((r) => alive && setHasAudio(r.ok))
      .catch(() => alive && setHasAudio(false));
    return () => {
      alive = false;
      audio.current?.pause();
      release.current?.();
    };
  }, [done]);

  if (!done) {
    return (
      <div className="flex flex-col items-center px-4 pb-4 pt-2 text-center">
        <PixelSprite name="trophy" scale={6} className="opacity-40 grayscale" />
        <p className="mt-4 text-xl">Todavía no…</p>
        <p className="mt-1 text-base text-ink-soft">Cuando encuentres todo, aquí te espera una sorpresa.</p>
        <div className="mt-4 grid w-full max-w-[280px] gap-2 text-left">
          <Bar label="Cositas" value={cositas} total={TOTAL} />
          <Bar label="Canciones" value={canciones} total={TOTAL_CANCIONES} />
        </div>
      </div>
    );
  }

  const play = () => {
    if (!audio.current) {
      audio.current = new Audio(logroFinal.audio);
      audio.current.addEventListener("ended", () => {
        setPlaying(false);
        release.current?.();
        release.current = null;
      });
    }
    if (playing) {
      audio.current.pause();
      setPlaying(false);
      release.current?.();
      release.current = null;
      return;
    }
    release.current = hold();
    void audio.current.play().then(
      () => setPlaying(true),
      () => setHasAudio(false),
    );
  };

  return (
    <div className={`relative flex flex-col items-center overflow-hidden px-4 pb-6 text-center ${inline ? "pt-2" : "pt-6"}`}>
      <Confetti />
      <motion.div
        initial={{ scale: 0.3, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 12 }}
      >
        <PixelSprite name="trophy" scale={7} className="trophy-glow" />
      </motion.div>
      <p className="mt-3 font-press text-[10px] text-rose-dark">{logroFinal.subtitulo.toUpperCase()}</p>
      <h3 className="mt-1 text-3xl leading-tight">{logroFinal.titulo}</h3>
      <p className="mt-3 text-lg leading-snug">{logroFinal.texto}</p>
      <motion.button
        type="button"
        disabled={hasAudio === false}
        onClick={() => {
          pop();
          play();
        }}
        className="btn-pixel btn-rose mt-5 px-5 py-2 text-lg"
        whileTap={{ scale: 0.96 }}
      >
        {hasAudio === false ? "Tu mensajito viene en camino ♥" : playing ? "❚❚ Pausar" : logroFinal.boton}
      </motion.button>
      <AnimatePresence>
        {playing ? (
          <motion.div className="mt-4 flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
              >
                <PixelSprite name="heartSmall" scale={3} palette={{ R: "#c38bff", W: "#f0e2ff" }} />
              </motion.span>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-press text-[10px]">
          {value}/{total}
        </span>
      </div>
      <span className="progress mt-1 block">
        <span className="progress-fill block" style={{ width: `${Math.min(100, (value / total) * 100)}%` }} />
      </span>
    </div>
  );
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: (i * 47) % 100,
        delay: (i % 11) * 0.25,
        duration: 2.8 + (i % 5) * 0.4,
        heart: i % 2 === 0,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute top-0"
          style={{ left: `${b.left}%` }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: 180 }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
        >
          {b.heart ? (
            <PixelSprite name="heartSmall" scale={3} palette={{ R: "#b46cff", W: "#ead6ff" }} />
          ) : (
            <PixelSprite name="tulip" scale={2} />
          )}
        </motion.span>
      ))}
    </div>
  );
}
