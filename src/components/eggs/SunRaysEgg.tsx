"use client";

import { Sun } from "lucide-react";

export function SunRaysEgg({ onReveal }: { onReveal: () => void }) {
  return (
    <button
      type="button"
      onClick={onReveal}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-md hover:bg-white/10"
      aria-label="Easter egg 5: Rayitos de sol"
    >
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[color:var(--sunset-gold)]/10 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20">
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--sunset-gold)]/35" />
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--sunset-gold)]/30" />
            </div>
            <Sun className="h-6 w-6 text-[color:var(--sunset-gold)]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[color:var(--foreground)]">
              Rayitos de sol
            </div>
            <div className="mt-1 text-xs text-[color:var(--foreground)]/60">
              Hover en PC o tócalo en celular
            </div>
          </div>
        </div>
        <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider text-[color:var(--love-300)]">
          5
        </div>
      </div>
    </button>
  );
}

