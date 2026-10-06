"use client";

import { motion, useReducedMotion } from "framer-motion";

export function UranusOrbit({
  onReveal,
}: {
  onReveal: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onReveal}
      className="group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-md hover:bg-white/10"
      aria-label="Easter egg 1: Urano orbitando"
    >
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/15 to-white/5" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      </div>

      <motion.div
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 7.5, ease: "linear", repeat: Infinity }
        }
      >
        <div className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#9be7ff] to-[#3fb0d6] shadow-lg shadow-[#3fb0d6]/20" />
        <div className="absolute left-1/2 top-[10px] h-10 w-16 -translate-x-1/2 rotate-[-18deg] rounded-full border border-white/30 opacity-70" />
      </motion.div>

      <div className="relative z-10 text-center">
        <div className="text-sm font-semibold tracking-tight text-[color:var(--foreground)]">
          Urano
        </div>
        <div className="mt-1 text-xs text-[color:var(--foreground)]/60">
          Tócalo y descubre el EE1
        </div>
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider text-[color:var(--love-300)]">
        1
      </div>
    </button>
  );
}

