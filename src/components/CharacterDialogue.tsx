"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { config } from "@/content/config";
import { dialogos } from "@/content/dialogos";
import { pop } from "@/lib/sound";
import { hush, speechStore, type Speech } from "@/lib/speech";
import { useTypewriter } from "@/lib/useTypewriter";
import { PixelSprite } from "./pixel/PixelSprite";

const pixelSteps = (n: number) => (t: number) => Math.min(1, Math.ceil(t * n) / n);

const purpleHeart = { K: "#2a0f4a", R: "#b46cff", W: "#ead6ff", D: "#8a3fe0" };
const purpleSmall = { R: "#c38bff", W: "#f0e2ff" };

/** River (and sometimes both of us) talking in a big Stardew dialogue box. */
export function CharacterDialogue() {
  const speech = speechStore.useValue();
  return <AnimatePresence>{speech ? <Dialogue key={speech.key} speech={speech} /> : null}</AnimatePresence>;
}

function Dialogue({ speech }: { speech: Speech }) {
  const { shown, done, skip } = useTypewriter(speech.texto.length, { cps: 40 });
  const closeRef = useRef<HTMLButtonElement>(null);
  const both = speech.quien === "nosotros";

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hush();
      if ((e.key === "Enter" || e.key === " ") && !done) {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, skip]);

  return (
    <motion.div
      className="fixed inset-0 z-[65] flex items-end justify-center px-3 pb-[max(16px,env(safe-area-inset-bottom))] sm:px-6 sm:pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div className="absolute inset-0 bg-[#0b0618]/55 backdrop-blur-[2px]" aria-hidden="true" />
      {speech.corazones ? <PurpleHearts /> : null}

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={dialogos.nombre}
        className="relative flex w-full max-w-[900px] flex-col items-end gap-2 sm:flex-row sm:items-stretch sm:gap-3"
        initial={{ y: 70, scaleY: 0.15, opacity: 0 }}
        animate={{ y: 0, scaleY: 1, opacity: 1 }}
        exit={{ y: 50, scaleY: 0.2, opacity: 0 }}
        transition={{ duration: 0.38, ease: pixelSteps(6) }}
        style={{ originY: 1 }}
      >
        {/* portrait: above the words on the phone, to their right on bigger screens */}
        <div className="flex flex-col items-stretch gap-1.5 sm:order-2 sm:w-[240px] sm:shrink-0">
          <div
            className={`frame-wood portrait relative flex items-end justify-center overflow-hidden ${
              both ? "h-[134px] w-[266px]" : "h-[162px] w-[162px]"
            } sm:h-auto sm:min-h-[214px] sm:w-full sm:flex-1`}
          >
            <motion.div
              className="flex origin-bottom items-end gap-1"
              initial={{ scale: 0.4, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.18 }}
            >
              <Portrait who="river" talking={!done} small={both} />
              {both ? (
                <>
                  <PixelSprite name="heart" scale={2} palette={purpleHeart} className="anim-late mb-10 self-center" />
                  <Portrait who="valeria" talking={false} small />
                </>
              ) : null}
            </motion.div>
          </div>
          <div className="nameplate px-3 py-1 text-center text-lg leading-tight">
            {both ? `${config.yo} ♥ ${config.ella}` : dialogos.nombre}
          </div>
        </div>

        {/* the words */}
        <div
          className="frame-wood paper-texture relative min-h-[180px] w-full cursor-pointer px-4 pb-9 pt-4 text-ink sm:order-1 sm:min-h-[240px] sm:px-7 sm:pt-6"
          onClick={() => (done ? undefined : skip())}
        >
          <p className="sr-only">{speech.texto}</p>
          <p aria-hidden="true" className="pr-10 text-[22px] leading-[1.45] [overflow-wrap:anywhere] sm:text-[26px]">
            {speech.texto.slice(0, shown)}
            <span className="opacity-0">{speech.texto.slice(shown)}</span>
          </p>

          {done ? <span className="blink absolute bottom-2 right-4 text-xl text-rose-dark">▼</span> : null}

          <button
            ref={closeRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              pop();
              hush();
            }}
            className="slot absolute right-2 top-2 grid h-11 w-11 place-items-center text-ink outline-none active:scale-95 sm:right-3 sm:top-3"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" strokeWidth={3} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** A portrait that moves its mouth while talking and blinks now and then. */
function Portrait({ who, talking, small }: { who: "river" | "valeria"; talking: boolean; small?: boolean }) {
  const [mouth, setMouth] = useState(false);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!talking) return;
    const id = window.setInterval(() => setMouth((m) => !m), 140);
    return () => {
      window.clearInterval(id);
      setMouth(false);
    };
  }, [talking]);

  useEffect(() => {
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        t = window.setTimeout(() => {
          setBlink(false);
          loop();
        }, 140);
      }, 1800 + Math.random() * 2600);
    };
    loop();
    return () => window.clearTimeout(t);
  }, []);

  const name =
    who === "river" ? (blink ? "riverBlink" : mouth ? "riverTalk" : "river") : blink ? "valeriaBlink" : "valeria";

  return (
    <PixelSprite
      name={name}
      scale={small ? 3 : 4}
      className={small ? "sm:h-[112px] sm:w-[112px]" : "sm:h-[190px] sm:w-[190px]"}
      title={who === "river" ? config.yo : config.ella}
    />
  );
}

/** Purple pixel hearts floating up the whole screen. */
function PurpleHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: (i * 37) % 100,
        delay: (i % 14) * 0.35 + (i > 13 ? 0.15 : 0),
        duration: 4.5 + ((i * 13) % 7) * 0.5,
        big: i % 3 === 0,
        sway: i % 2 ? 18 : -18,
      })),
    [],
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0"
          style={{ left: `${h.left}%` }}
          initial={{ y: "10vh", opacity: 0 }}
          animate={{ y: "-105vh", x: [0, h.sway, 0, -h.sway, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "linear" }}
        >
          {h.big ? (
            <PixelSprite name="heart" scale={3} palette={purpleHeart} />
          ) : (
            <PixelSprite name="heartSmall" scale={4} palette={purpleSmall} />
          )}
        </motion.span>
      ))}
    </div>
  );
}
