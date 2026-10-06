"use client";

import { IceCreamCone } from "lucide-react";

export function OreoIceCreamEgg({ onReveal }: { onReveal: () => void }) {
  return (
    <button
      type="button"
      onClick={onReveal}
      className="group relative flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-md hover:bg-white/10"
      aria-label="Easter egg 2: Helado de Oreo"
    >
      <div className="flex items-center gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20">
          <IceCreamCone className="h-6 w-6 text-[color:var(--love-300)]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[color:var(--foreground)]">
            Helado de Oreo
          </div>
          <div className="mt-1 text-xs text-[color:var(--foreground)]/60">
            Un antojito dulce escondido en el EE2
          </div>
        </div>
      </div>
      <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider text-[color:var(--love-300)]">
        2
      </div>
    </button>
  );
}

