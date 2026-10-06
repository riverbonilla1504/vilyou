"use client";

import { Sparkles } from "lucide-react";

export function PinkyEgg({ onReveal }: { onReveal: () => void }) {
  return (
    <button
      type="button"
      onClick={onReveal}
      className="group relative flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-md hover:bg-white/10"
      aria-label="Easter egg 6: Pinky"
    >
      <div className="flex items-center gap-4">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20">
          <div className="absolute h-8 w-6 rounded-[18px] bg-[color:var(--accent)]/70" />
          <div className="absolute h-7 w-5 translate-x-1 rounded-[16px] bg-[color:var(--love-300)]/70" />
          <Sparkles className="relative h-5 w-5 text-[color:var(--love-100)]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[color:var(--foreground)]">
            Pinky, nuestra hijita
          </div>
          <div className="mt-1 text-xs text-[color:var(--foreground)]/60">
            Una pitahaya de peluche con magia
          </div>
        </div>
      </div>
      <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider text-[color:var(--love-300)]">
        6
      </div>
    </button>
  );
}

