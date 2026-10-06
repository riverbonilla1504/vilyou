"use client";

import { Moon, Sunset } from "lucide-react";

export function MoonSunsetEgg({ onReveal }: { onReveal: () => void }) {
  return (
    <button
      type="button"
      onClick={onReveal}
      className="group relative flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-md hover:bg-white/10"
      aria-label="Easter egg 4: Atardecer y luna"
    >
      <div className="flex items-center gap-4">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20">
          <Sunset className="absolute h-6 w-6 text-[color:var(--sunset-gold)] opacity-90" />
          <Moon className="absolute h-5 w-5 translate-x-3 -translate-y-3 text-[color:var(--love-100)] opacity-90" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[color:var(--foreground)]">
            Atardecer & Luna
          </div>
          <div className="mt-1 text-xs text-[color:var(--foreground)]/60">
            Donde el cielo se pinta y tú me haces sonreír
          </div>
        </div>
      </div>
      <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider text-[color:var(--love-300)]">
        4
      </div>
    </button>
  );
}

