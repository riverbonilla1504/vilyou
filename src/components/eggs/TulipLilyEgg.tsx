"use client";

import { Flower2 } from "lucide-react";

export function TulipLilyEgg({ onReveal }: { onReveal: () => void }) {
  return (
    <button
      type="button"
      onClick={onReveal}
      className="group relative flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 text-left shadow-md hover:brightness-110"
      aria-label="Easter egg 7: Tulipanes y lirios"
    >
      <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[color:var(--accent)]/12 blur-2xl" />
      <div className="flex items-center gap-4">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20">
          <Flower2 className="h-6 w-6 text-[color:var(--love-300)]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[color:var(--foreground)]">
            Tulipanes & Lirios
          </div>
          <div className="mt-1 text-xs text-[color:var(--foreground)]/60">
            El número 7 florece con nosotros
          </div>
        </div>
      </div>
      <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider text-[color:var(--love-300)]">
        7
      </div>
    </button>
  );
}

