"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { config } from "@/content/config";
import { pad, splitDuration, useNow } from "@/lib/clock";
import { meow } from "@/lib/sound";
import { HeartPadlock } from "./Keypad";
import { PixelScene } from "./PixelScene";
import { PixelSprite } from "./pixel/PixelSprite";

/** The countdown she sees until the gift unlocks. */
export function LockScreen({ unlockAt, ready, onEnter }: { unlockAt: number; ready: boolean; onEnter: () => void }) {
  const [meows, setMeows] = useState(0);

  const fecha = new Date(unlockAt).toLocaleString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="screen relative flex flex-col items-center justify-center overflow-hidden px-4 text-center">
      <PixelScene themeId={ready ? "love" : "carta"} />

      <motion.p
        className="on-scene text-lg text-cream/80"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Para {config.ella}
      </motion.p>

      <motion.h1
        className="on-scene mt-2 text-[34px] leading-tight text-cream sm:text-5xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {ready ? "¡Ya es hora! ♥" : "Algo bonito te espera…"}
      </motion.h1>

      <div className="relative mt-8 flex items-end justify-center gap-6">
        <button
          type="button"
          onClick={() => {
            meow();
            setMeows((m) => m + 1);
          }}
          className="relative"
          aria-label="Mía durmiendo"
        >
          <PixelSprite name="catSleep" scale={5} />
          <span className="zzz absolute -right-2 -top-6 font-press text-xs text-cream">z</span>
          <span className="zzz absolute -right-6 -top-11 font-press text-sm text-cream" style={{ animationDelay: "0.8s" }}>
            z
          </span>
          <AnimatePresence>
            {meows > 0 ? (
              <motion.span
                key={meows}
                className="speech absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 text-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ¡Miau! (Mía también espera)
              </motion.span>
            ) : null}
          </AnimatePresence>
        </button>

        <div className="relative flex flex-col items-center">
          <PixelSprite name="envelope" scale={6} />
          <HeartPadlock state={ready ? "opening" : "locked"} className="absolute -bottom-10 left-1/2 -translate-x-1/2 scale-75" />
        </div>
      </div>

      <div className="frame-wood countdown mt-14 px-3 py-3 text-ink sm:px-5">
        {ready ? (
          <motion.button
            type="button"
            onClick={onEnter}
            className="btn-pixel btn-rose px-6 py-3 text-xl"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            Abrir mi regalo ♥
          </motion.button>
        ) : (
          <Countdown unlockAt={unlockAt} />
        )}
      </div>

      {!ready ? (
        <p className="on-scene mt-6 max-w-xs text-base text-cream/75">
          Se abre el {fecha}.
          <br />
          Puedes dejar esta página abierta.
        </p>
      ) : null}
    </div>
  );
}

function Countdown({ unlockAt }: { unlockAt: number }) {
  const now = useNow();
  const { dias, horas, minutos, segundos } = splitDuration(now ? unlockAt - now : 0);
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <Unit value={dias} label="días" />
      <Colon />
      <Unit value={horas} label="horas" />
      <Colon />
      <Unit value={minutos} label="min" />
      <Colon />
      <Unit value={segundos} label="seg" />
    </div>
  );
}

function Colon() {
  return <span className="blink pt-3 font-press text-lg text-ink-soft">:</span>;
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = pad(value);
  return (
    <div className="flex flex-col items-center">
      <div className="slot flex h-14 items-center justify-center overflow-hidden px-2 font-press text-xl sm:h-16 sm:text-2xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: -22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 22, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 text-xs text-ink-soft">{label}</span>
    </div>
  );
}
