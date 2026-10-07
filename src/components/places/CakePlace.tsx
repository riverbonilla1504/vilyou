"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { config } from "@/content/config";
import { pastel } from "@/content/lugares";
import { discover } from "@/lib/discoveries";
import { blowSound, fanfare, pop } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { HeartConfetti } from "../HeartConfetti";
import { PixelSprite } from "../pixel/PixelSprite";
import { HiddenNote } from "@/components/HiddenNote";
import { HiddenPinky } from "@/components/Sorpresas";

type Step = "wish" | "blow" | "done";

/** A birthday-style cake with one candle per month. */
export function CakePlace() {
  const total = config.meses;
  const [lit, setLit] = useState<boolean[]>(() => Array.from({ length: total }, () => true));
  const [step, setStep] = useState<Step>("wish");
  const [mic, setMic] = useState<"off" | "on" | "denied">("off");
  const [bitten, setBitten] = useState(0);
  const stopMic = useRef<() => void>(() => {});
  const litRef = useRef(lit);

  useEffect(() => {
    litRef.current = lit;
  });

  useEffect(() => () => stopMic.current(), []);

  const blowOut = (indexes: number[]) => {
    if (!indexes.length) return;
    blowSound();
    const next = litRef.current.map((v, i) => (indexes.includes(i) ? false : v));
    litRef.current = next;
    setLit(next);
    if (next.every((v) => !v)) {
      stopMic.current();
      window.setTimeout(() => {
        fanfare();
        setStep("done");
        discover("velas");
      }, 500);
    }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let raf = 0;
      let loud = 0;
      let cooldown = 0;
      const loop = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / data.length);
        loud = rms > 0.18 ? loud + 1 : Math.max(0, loud - 1);
        cooldown = Math.max(0, cooldown - 1);
        if (loud > 5 && cooldown === 0) {
          cooldown = 12;
          const on = litRef.current.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
          const n = Math.min(on.length, 1 + Math.floor(Math.random() * 3));
          blowOut(on.sort(() => Math.random() - 0.5).slice(0, n));
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      stopMic.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
        setMic("off");
      };
      setMic("on");
    } catch {
      setMic("denied");
    }
  };

  const remaining = lit.filter(Boolean).length;

  return (
    <div className="cake-room absolute inset-0 overflow-y-auto overscroll-contain">
      <HiddenNote spot="pastel" className="left-[5%] top-[40%]" />
      <HiddenPinky spot="pastel" className="right-[5%] top-[62%]" />
      <div className="flex min-h-full flex-col items-center justify-center px-4 pb-10 pt-20 text-center">
        <motion.h3
          className="on-scene text-[32px] leading-tight text-cream sm:text-4xl"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {pastel.titulo}
        </motion.h3>

        <div className="relative mt-20">
          {/* candles */}
          <div className="absolute -top-[54px] left-1/2 flex -translate-x-1/2 gap-[10px] sm:gap-3">
            {lit.map((on, i) => (
              <button
                key={i}
                type="button"
                className="relative flex h-[60px] w-6 flex-col items-center justify-end"
                onClick={() => step === "blow" && on && blowOut([i])}
                aria-label={on ? `Soplar la velita ${i + 1}` : `Velita ${i + 1} apagada`}
                disabled={step !== "blow" || !on}
              >
                <AnimatePresence>
                  {on ? (
                    <motion.span
                      key="flame"
                      className="flame absolute top-0"
                      style={{ animationDelay: `${i * 0.13}s` }}
                      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                    />
                  ) : (
                    <motion.span
                      key="smoke"
                      className="smoke absolute top-1"
                      initial={{ opacity: 0.8, y: 0 }}
                      animate={{ opacity: 0, y: -26 }}
                      transition={{ duration: 1.4 }}
                    />
                  )}
                </AnimatePresence>
                <span className={cn("candle", i % 2 ? "candle-b" : "candle-a")} />
              </button>
            ))}
          </div>

          {/* cake */}
          <motion.button
            type="button"
            className="cake relative block"
            onClick={() => {
              if (step !== "done") return;
              pop();
              setBitten((b) => Math.min(3, b + 1));
              discover("mordisco");
            }}
            aria-label="Pastel"
            whileTap={step === "done" ? { scale: 0.97 } : undefined}
          >
            <span className="cake-top" />
            <span className="cake-tier cake-tier-1" style={biteMask(bitten)}>
              <span className="cake-drips" />
              <span className="cake-hearts">
                <PixelSprite name="heartSmall" scale={2} />
                <span className="font-press text-[11px] text-rose-dark">
                  {config.inicialElla} ♥ {config.inicialYo}
                </span>
                <PixelSprite name="heartSmall" scale={2} />
              </span>
            </span>
            <span className="cake-tier cake-tier-2">
              <span className="cake-drips" />
              <span className="cake-number font-press">{config.meses}</span>
            </span>
            <span className="cake-plate" />
          </motion.button>
        </div>

        <div className="mt-8 min-h-[150px] w-full max-w-sm">
          <AnimatePresence mode="wait">
            {step === "wish" ? (
              <motion.div key="wish" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="on-scene text-lg text-cream">{pastel.deseo}</p>
                <button
                  type="button"
                  onClick={() => {
                    pop();
                    discover("deseo");
                    setStep("blow");
                  }}
                  className="btn-pixel btn-rose mt-4 px-5 py-2.5 text-lg"
                >
                  Ya pedí mi deseo ✨
                </button>
              </motion.div>
            ) : step === "blow" ? (
              <motion.div key="blow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="on-scene text-lg text-cream">{pastel.soplar}</p>
                <p className="on-scene mt-1 text-sm text-cream/70">
                  Quedan {remaining} de {total}
                </p>
                {mic === "off" ? (
                  <button type="button" onClick={startMic} className="btn-pixel mt-4 px-5 py-2.5 text-lg">
                    🎤 Soplar con el micrófono
                  </button>
                ) : mic === "on" ? (
                  <p className="on-scene mt-4 animate-pulse text-base text-gold">¡Sopla fuerte al celular! 🌬️</p>
                ) : (
                  <p className="on-scene mt-4 text-sm text-cream/80">
                    Sin micrófono no pasa nada: toca cada velita para soplarla.
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="frame-paper paper-texture px-5 py-4 text-ink">
                  <p className="text-lg leading-snug">{pastel.final}</p>
                  <p className="mt-2 text-sm text-ink-soft">
                    {bitten ? "¡Ñam! Guárdame un pedacito." : "Psst… dale un mordisco al pastel."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {step === "done" ? <HeartConfetti /> : null}
    </div>
  );
}

function biteMask(n: number): React.CSSProperties | undefined {
  if (!n) return undefined;
  const r = 12 + n * 9;
  const mask = `radial-gradient(circle ${r}px at calc(100% - 4px) 4px, transparent 96%, #000 100%)`;
  return { WebkitMaskImage: mask, maskImage: mask };
}
