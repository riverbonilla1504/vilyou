"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { carta } from "@/content/carta";
import { config } from "@/content/config";
import { discover } from "@/lib/discoveries";
import { progressStore } from "@/lib/flags";
import { chime, pop, swoosh } from "@/lib/sound";
import { useTypewriter } from "@/lib/useTypewriter";
import { HeartPadlock, Keypad } from "./Keypad";
import { PixelEnvelope } from "./PixelEnvelope";
import { PixelSprite } from "./pixel/PixelSprite";

const pixelSteps = (n: number) => (t: number) => Math.min(1, Math.ceil(t * n) / n);

export function RetroLetter({
  reread = false,
  onEnterUniverse,
}: {
  /** Opened again from the universe: no envelope, text shown at once. */
  reread?: boolean;
  onEnterUniverse?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const progress = progressStore.useValue();
  const [stage, setStage] = useState<"closed" | "opening" | "open">(reread ? "open" : "closed");
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [padlock, setPadlock] = useState<"locked" | "opening" | "gone">(progress.candado ? "gone" : "locked");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const open = () => {
    if (stage !== "closed") return;
    swoosh();
    if (reduceMotion) {
      setStage("open");
      return;
    }
    setStage("opening");
    later(() => setStage("open"), 1500);
  };

  const tapEnvelope = () => {
    if (padlock === "locked") {
      pop();
      setKeypadOpen(true);
      return;
    }
    if (padlock === "gone") open();
  };

  const unlocked = () => {
    setKeypadOpen(false);
    progressStore.set((p) => ({ ...p, candado: true }));
    discover("candado");
    setPadlock("opening");
    later(() => setPadlock("gone"), 650);
    later(open, 1500);
  };

  const locked = padlock !== "gone";

  return (
    <div className="pointer-events-none relative flex w-full flex-col items-center *:pointer-events-auto">
      <AnimatePresence mode="wait">
        {stage !== "open" ? (
          <motion.div
            key="envelope"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.15, filter: "brightness(2)", transition: { duration: 0.25 } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="speech mb-6 px-5 py-3 text-center text-lg text-ink md:text-xl"
              animate={stage === "opening" ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
            >
              ¡Tienes una carta nueva!
              <span className="blink ml-2 inline-block text-rose">▼</span>
            </motion.div>

            <motion.button
              type="button"
              onClick={tapEnvelope}
              aria-label={locked ? "La carta tiene candado: ingresar el código" : "Abrir la carta"}
              className="envelope-button group relative cursor-pointer outline-none"
              animate={
                stage === "opening"
                  ? { rotate: [0, -5, 5, -4, 4, 0], y: 0, transition: { duration: 0.4 } }
                  : { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] }
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              whileTap={stage === "closed" ? { scale: 0.96 } : undefined}
            >
              <span className="envelope-glow" />
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`envelope-sparkle envelope-sparkle-${i}`}>
                  <PixelSprite name="sparkle" scale={3} />
                </span>
              ))}
              <PixelEnvelope opening={stage === "opening"} className="relative h-auto w-[min(300px,72vw)]" />
              <HeartPadlock state={padlock} className="absolute left-1/2 top-[38%] -translate-x-1/2" />
            </motion.button>

            <motion.p
              className="on-scene mt-8 text-base tracking-wide text-cream/85"
              animate={stage === "opening" ? { opacity: 0 } : { opacity: 1 }}
            >
              {locked ? "Tiene un candadito… tócalo" : "Toca el sobre para abrirla"}
            </motion.p>
          </motion.div>
        ) : (
          <LetterPaper
            key="letter"
            instant={!!reduceMotion}
            reread={reread}
            onEnterUniverse={onEnterUniverse}
          />
        )}
      </AnimatePresence>

      <Keypad
        open={keypadOpen}
        code={config.candado.codigo}
        hint={config.candado.pista}
        onSuccess={unlocked}
        onClose={() => setKeypadOpen(false)}
      />
    </div>
  );
}

const burst = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 170 + (i % 3) * 50;
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist * 0.8, heart: i % 2 === 0 };
});

function LetterPaper({
  instant,
  reread,
  onEnterUniverse,
}: {
  instant: boolean;
  reread: boolean;
  onEnterUniverse?: () => void;
}) {
  const segments = [carta.saludo, ...carta.parrafos];
  const starts = segments.map((_, i) => segments.slice(0, i).reduce((sum, s) => sum + s.length, 0));
  const total = segments.reduce((sum, s) => sum + s.length, 0);

  const [unfolded, setUnfolded] = useState(instant);
  const { shown, done, skip } = useTypewriter(total, { active: unfolded, cps: 52, startDone: reread });
  const caretSeg = done ? -1 : segments.findIndex((s, i) => shown < starts[i] + s.length);

  useEffect(() => {
    if (!done || reread) return;
    discover("carta");
    progressStore.set((p) => ({ ...p, cartaLeida: true }));
  }, [done, reread]);

  return (
    <div className="pointer-events-none relative flex w-full flex-col items-center *:pointer-events-auto">
      {!instant && !reread
        ? burst.map((b, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute left-1/2 top-[30%] z-0"
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
              animate={{ x: b.x, y: b.y, opacity: [0, 1, 1, 0], scale: [0.4, 1.2, 1, 0.6] }}
              transition={{ duration: 1.3, delay: 0.2, ease: "easeOut" }}
            >
              <PixelSprite name={b.heart ? "heartSmall" : "sparkle"} scale={4} />
            </motion.span>
          ))
        : null}

      <motion.article
        className="frame-paper paper-texture relative z-10 w-full max-w-[680px] cursor-default px-5 pb-8 pt-7 text-ink sm:px-10 md:px-14 md:pb-12 md:pt-10"
        initial={instant ? false : { scaleX: 0.5, scaleY: 0.03, opacity: 0 }}
        animate={{ scaleX: [0.5, 1, 1], scaleY: [0.03, 0.03, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 0.8, times: [0, 0.35, 1], ease: pixelSteps(10) }}
        onAnimationComplete={() => setUnfolded(true)}
        onClick={() => {
          if (!done) skip();
        }}
        aria-label="Carta"
      >
        <PixelSprite name="heartSmall" scale={3} className="absolute left-4 top-4 opacity-70" />
        <PixelSprite name="heartSmall" scale={3} className="absolute right-4 top-4 opacity-70" />
        <PixelSprite name="lily" scale={9} className="pointer-events-none absolute bottom-24 right-4 opacity-[0.07]" />

        <header className="flex items-baseline justify-between gap-4 px-4 text-sm text-ink-soft md:text-base">
          <span>{carta.para}</span>
          <span className="text-right">{carta.fecha}</span>
        </header>
        <div className="dotted-rule mx-4 mt-3" />

        {!done ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              skip();
            }}
            className="btn-pixel absolute -top-5 right-6 z-20 px-3 py-1 text-sm"
          >
            Mostrar todo ▸▸
          </button>
        ) : null}

        <div className="sr-only">
          {segments.map((s, i) => (
            <p key={i}>{s}</p>
          ))}
        </div>

        <div aria-hidden="true" className="mt-6 space-y-4 text-[19px] leading-[1.6] md:text-[22px]">
          {segments.map((text, i) => {
            const n = Math.max(0, Math.min(text.length, shown - starts[i]));
            const Tag = i === 0 ? "h2" : "p";
            return (
              <Tag key={i} className={i === 0 ? "text-2xl text-rose-dark md:text-3xl" : undefined}>
                {text.slice(0, n)}
                {caretSeg === i ? (
                  <span className="relative inline-block w-0">
                    <span className="caret" />
                  </span>
                ) : null}
                <span className="opacity-0">{text.slice(n)}</span>
              </Tag>
            );
          })}
        </div>

        <motion.footer
          initial={false}
          animate={done ? "show" : "hide"}
          variants={{ hide: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.35 } } }}
          className="mt-8"
        >
          <div className="flex items-end justify-end gap-5">
            <div className="text-right">
              <motion.p variants={fadeUp} className="text-lg text-ink-soft md:text-xl">
                {carta.despedida}
              </motion.p>
              <motion.p
                variants={{
                  hide: { clipPath: "inset(0 100% 0 0)" },
                  show: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.9, ease: pixelSteps(12) } },
                }}
                className="signature mt-1 text-3xl text-rose-dark md:text-4xl"
              >
                {carta.firma}
              </motion.p>
            </div>
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                pop();
                discover("sello");
              }}
              variants={{
                hide: { scale: 2.6, rotate: -30, opacity: 0 },
                show: {
                  scale: 1,
                  rotate: -10,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 500, damping: 18 },
                },
              }}
              whileTap={{ scale: 0.85, rotate: 8 }}
              className="wax-seal"
              aria-label="Sello de cera"
            >
              <PixelSprite name="heart" scale={3} palette={{ K: "#7a1030", R: "#d8335e", W: "#ff9ab5", D: "#a81f48" }} />
            </motion.button>
          </div>

          {carta.posdata ? (
            <motion.p variants={fadeUp} className="mt-8 text-base text-ink-soft md:text-lg">
              {carta.posdata}
            </motion.p>
          ) : null}

          <motion.div variants={fadeUp}>
            <Gift />
          </motion.div>
        </motion.footer>
      </motion.article>

      {onEnterUniverse ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: done && !reread ? 2.2 : 0 }}
          className="mt-10 flex flex-col items-center gap-3"
          style={{ pointerEvents: done ? "auto" : "none" }}
        >
          <p className="on-scene text-base text-cream/85">Hay un universo esperándote…</p>
          <motion.button
            type="button"
            onClick={onEnterUniverse}
            className="btn-pixel btn-rose universe-cta px-6 py-3 text-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            ✦ Entrar a nuestro universo ✦
          </motion.button>
        </motion.div>
      ) : null}
    </div>
  );
}

const fadeUp = {
  hide: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function Gift() {
  const { regalo } = carta;
  const [received, setReceived] = useState(false);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">Adjunto</div>
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (received) {
              pop();
              return;
            }
            chime();
            setReceived(true);
            discover("regalo");
          }}
          className="slot relative grid h-[76px] w-[76px] place-items-center"
          whileTap={{ scale: 0.94 }}
          aria-label={received ? `${regalo.nombre}, recibido` : `Recibir ${regalo.nombre}`}
        >
          <motion.span
            animate={received ? { y: [0, -26, -4], scale: [1, 1.5, 1.1] } : { y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <PixelSprite name={regalo.sprite} scale={4} className={received ? "anim-late" : "anim-flota"} />
          </motion.span>
          {regalo.cantidad > 1 ? (
            <span className="absolute bottom-1 right-2 font-press text-[10px] text-ink">{regalo.cantidad}</span>
          ) : null}
          <AnimatePresence>
            {received ? (
              <motion.span
                key="burst"
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const a = (i / 6) * Math.PI * 2;
                  return (
                    <motion.span
                      key={i}
                      className="absolute left-1/2 top-1/2"
                      initial={{ x: -7, y: -7 }}
                      animate={{ x: Math.cos(a) * 54 - 7, y: Math.sin(a) * 54 - 7 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <PixelSprite name="sparkle" scale={3} />
                    </motion.span>
                  );
                })}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.button>
        <div className="min-w-0 text-left">
          <div className="text-lg text-ink md:text-xl">
            {regalo.nombre}
            {regalo.cantidad > 1 ? ` ×${regalo.cantidad}` : ""}
          </div>
          <div className="text-sm text-ink-soft">
            {received ? "¡Recibido! Ahora es tuyo ♥" : "Toca para recibirlo"}
          </div>
        </div>
      </div>
    </div>
  );
}
