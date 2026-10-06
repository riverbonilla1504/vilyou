"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useRef, useState } from "react";
import { config } from "@/content/config";
import { pad, splitDuration, useNow } from "@/lib/clock";
import { meow, pop, purr } from "@/lib/sound";
import { HeartPadlock } from "./Keypad";
import { PixelScene } from "./PixelScene";
import { PixelSprite } from "./pixel/PixelSprite";
import { TapBursts } from "./TapBursts";

const miaLines = [
  "¡Miau! (Mía también espera)",
  "Mía dice que falta poquito",
  "Mía te manda un cabezazo de amor",
  "Prrr… sigue consintiéndome",
  "Mía vigila el sobre por ti",
  "Miau miau (traducción: te quiero)",
];

const envelopeLines = [
  "¡Todavía no! Se abre a medianoche 🔒",
  "Está bien cerradito… espera un poquito",
  "Adentro hay algo muy bonito para ti",
  "Ni Mía sabe qué dice 🤫",
];

const countdownLines = [
  "Cada segundo falta menos 💜",
  "¿Ya tocaste la luna?",
  "Las nubes también esconden algo…",
  "Prueba tocar los tulipanes del suelo",
  "A veces pasa una estrella fugaz: ¡atrápala!",
  "Toca el cielo y llénalo de corazones",
];

/** The countdown she sees until the gift unlocks, full of little things to tap. */
export function LockScreen({ unlockAt, ready, onEnter }: { unlockAt: number; ready: boolean; onEnter: () => void }) {
  const [bubble, setBubble] = useState<{ who: "mia" | "sobre"; text: string; key: number } | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [hearts, setHearts] = useState(0);
  const count = useRef({ mia: 0, sobre: 0, reloj: 0, key: 0 });
  const mia = useAnimationControls();
  const envelope = useAnimationControls();
  const clock = useAnimationControls();

  const say = (who: "mia" | "sobre", lines: string[]) => {
    const c = count.current;
    c.key += 1;
    const n = c[who]++;
    setBubble({ who, text: lines[n % lines.length], key: c.key });
    return n + 1;
  };

  const fecha = new Date(unlockAt).toLocaleString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="screen relative isolate flex flex-col items-center justify-center overflow-hidden px-4 text-center">
      <PixelScene themeId={ready ? "love" : "carta"} interactive />
      <TapBursts onTap={() => setHearts((h) => h + 1)} />

      <motion.p
        className="on-scene pointer-events-none text-lg text-cream/90"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {config.dedicatoria}
      </motion.p>

      <motion.h1
        className="on-scene pointer-events-none mt-2 text-[34px] leading-tight text-cream sm:text-5xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {ready ? "¡Ya es hora! ♥" : "Algo bonito te espera…"}
      </motion.h1>

      <div className="pointer-events-none relative mt-10 flex items-end justify-center gap-8 *:pointer-events-auto">
        <AnimatePresence>
          {bubble ? (
            <motion.div
              key={bubble.key}
              className={`speech absolute -top-16 z-10 max-w-[220px] px-3 py-1.5 text-sm leading-snug ${
                bubble.who === "mia" ? "left-0" : "right-0"
              }`}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {bubble.text}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          animate={mia}
          onClick={() => {
            meow();
            const n = say("mia", miaLines);
            void mia.start({ y: [0, -22, 0], rotate: [0, -8, 6, 0], transition: { duration: 0.5 } });
            if (n % 7 === 0) window.setTimeout(purr, 350);
          }}
          className="relative"
          aria-label="Mía durmiendo"
        >
          <PixelSprite name="catSleep" scale={5} />
          <span className="zzz pointer-events-none absolute -right-2 -top-6 font-press text-xs text-cream">z</span>
          <span
            className="zzz pointer-events-none absolute -right-6 -top-11 font-press text-sm text-cream"
            style={{ animationDelay: "0.8s" }}
          >
            z
          </span>
          <span className="tap-hint absolute -bottom-6 left-1/2 -translate-x-1/2">
            <PixelSprite name="heartSmall" scale={2} />
          </span>
        </motion.button>

        <motion.button
          type="button"
          animate={envelope}
          onClick={() => {
            pop();
            say("sobre", envelopeLines);
            void envelope.start({ rotate: [0, -10, 10, -6, 6, 0], transition: { duration: 0.5 } });
          }}
          className="relative flex flex-col items-center"
          aria-label="El sobre con candado"
        >
          <PixelSprite name="envelope" scale={6} />
          <HeartPadlock
            state={ready ? "opening" : "locked"}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 scale-75"
          />
        </motion.button>
      </div>

      <motion.div animate={clock} className="frame-wood countdown mt-16 px-3 py-3 text-ink sm:px-5">
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
          <button
            type="button"
            aria-label="Cuenta regresiva"
            onClick={() => {
              pop();
              const n = count.current.reloj++;
              setTip(countdownLines[n % countdownLines.length]);
              void clock.start({ scale: [1, 1.06, 0.98, 1], transition: { duration: 0.4 } });
            }}
          >
            <Countdown unlockAt={unlockAt} />
          </button>
        )}
      </motion.div>

      <div className="pointer-events-none mt-5 min-h-[56px]">
        <AnimatePresence mode="wait">
          {tip ? (
            <motion.p
              key={tip}
              className="on-scene text-base text-gold"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {tip}
            </motion.p>
          ) : !ready ? (
            <motion.p key="fecha" className="on-scene pointer-events-none text-base text-cream/75" exit={{ opacity: 0 }}>
              Se abre el {fecha}.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <motion.div
        className="tap-chip on-scene pointer-events-none mt-3 flex items-center gap-2 px-3 py-1.5 text-sm text-cream"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <span className="tap-finger">👆</span>
        {hearts > 0
          ? `Llevas ${hearts} corazones en el cielo ♥`
          : "Psst… aquí todo se puede tocar: Mía, la luna, las nubes, el sobre…"}
      </motion.div>
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
