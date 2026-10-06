"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Delete, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { buzz, pop, unlockSound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";

const pixelSteps = (n: number) => (t: number) => Math.min(1, Math.ceil(t * n) / n);

/** A retro keypad that opens when the right code is typed. */
export function Keypad({
  open,
  code,
  hint,
  onSuccess,
  onClose,
}: {
  open: boolean;
  code: string;
  hint: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? <KeypadDialog key="keypad" code={code} hint={hint} onSuccess={onSuccess} onClose={onClose} /> : null}
    </AnimatePresence>
  );
}

function KeypadDialog({
  code,
  hint,
  onSuccess,
  onClose,
}: {
  code: string;
  hint: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [digits, setDigits] = useState("");
  const [state, setState] = useState<"typing" | "wrong" | "right">("typing");
  const [tries, setTries] = useState(0);
  const shake = useAnimationControls();

  const press = useCallback(
    (d: string) => {
      if (state !== "typing") return;
      pop();
      const next = (digits + d).slice(0, code.length);
      setDigits(next);
      if (next.length < code.length) return;

      if (next === code) {
        setState("right");
        unlockSound();
        window.setTimeout(onSuccess, 700);
      } else {
        setState("wrong");
        setTries((t) => t + 1);
        buzz();
        void shake.start({ x: [0, -14, 14, -10, 10, -5, 5, 0], transition: { duration: 0.45 } });
        window.setTimeout(() => {
          setDigits("");
          setState("typing");
        }, 750);
      }
    },
    [code, digits, onSuccess, shake, state],
  );

  const erase = useCallback(() => {
    if (state !== "typing") return;
    setDigits((d) => d.slice(0, -1));
  }, [state]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") erase();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [erase, onClose, press]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Candado de la carta"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#0b0618]/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar"
        tabIndex={-1}
      />

      <motion.div
        className="relative w-full max-w-[340px]"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: pixelSteps(5) }}
      >
        <motion.div animate={shake} className="frame-wood paper-texture relative px-4 pb-5 pt-4 text-center text-ink">
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-2 -top-2 grid h-10 w-10 place-items-center text-ink-soft"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xl">
            <PixelSprite name="heart" scale={2} palette={GOLD} />
            Ingresa el código
          </div>

          <div className="mt-4 flex justify-center gap-1.5" aria-live="polite">
            {Array.from({ length: code.length }).map((_, i) => {
              const filled = i < digits.length;
              return (
                <motion.div
                  key={i}
                  className={cn(
                    "slot grid h-12 w-10 place-items-center font-press text-base",
                    state === "wrong" && "slot-wrong",
                    state === "right" && "slot-found",
                  )}
                  animate={filled ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {filled ? (
                    <span className={state === "wrong" ? "text-rose-dark" : "text-ink"}>{digits[i]}</span>
                  ) : (
                    <PixelSprite name="heartSmall" scale={2} className="opacity-40" />
                  )}
                </motion.div>
              );
            })}
          </div>

          <p className="mt-3 min-h-[2.6em] text-sm leading-snug text-ink-soft">
            {state === "wrong"
              ? "Mmm… casi. ¡Intenta otra vez!"
              : state === "right"
                ? "¡Abierto! ♥"
                : tries >= 2
                  ? hint
                  : "Un número muy especial…"}
          </p>

          <div className="mt-2 grid grid-cols-3 gap-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
              <KeyButton key={n} onPress={() => press(n)}>
                {n}
              </KeyButton>
            ))}
            <KeyButton onPress={erase} label="Borrar">
              <Delete className="mx-auto h-5 w-5" />
            </KeyButton>
            <KeyButton onPress={() => press("0")}>0</KeyButton>
            <KeyButton onPress={onClose} label="Cerrar" muted>
              <X className="mx-auto h-5 w-5" />
            </KeyButton>
          </div>

          {tries < 2 ? (
            <button type="button" onClick={() => setTries(2)} className="mt-3 text-sm text-rose-dark underline">
              ¿Una pista?
            </button>
          ) : null}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const GOLD = { K: "#5a3a08", R: "#f2c14e", W: "#fff1b8", D: "#c9922a" };

function KeyButton({
  children,
  onPress,
  label,
  muted,
}: {
  children: React.ReactNode;
  onPress: () => void;
  label?: string;
  muted?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onPress}
      aria-label={label}
      whileTap={{ scale: 0.92, y: 2 }}
      className={cn("btn-pixel h-14 font-press text-lg", muted && "opacity-80")}
    >
      {children}
    </motion.button>
  );
}

/** The heart-shaped golden padlock that hangs on the envelope. */
export function HeartPadlock({ state, className }: { state: "locked" | "opening" | "gone"; className?: string }) {
  return (
    <AnimatePresence>
      {state !== "gone" ? (
        <motion.div
          className={cn("pointer-events-none relative flex flex-col items-center", className)}
          initial={{ opacity: 1 }}
          exit={{ y: 260, rotate: 35, opacity: 0, transition: { duration: 0.8, ease: "easeIn" } }}
        >
          <motion.div
            animate={state === "opening" ? { y: -14 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 14 }}
            className="-mb-[3px]"
          >
            <PixelSprite name="shackle" scale={4} />
          </motion.div>
          <motion.div
            className="relative"
            animate={state === "locked" ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
            transition={state === "locked" ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : undefined}
          >
            <PixelSprite name="heart" scale={4} palette={GOLD} />
            <PixelSprite name="keyhole" scale={4} className="absolute left-1/2 top-[34%] -translate-x-1/2" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
