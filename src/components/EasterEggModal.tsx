"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

export type EasterEggPayload = {
  id: number;
  title: string;
  placeholder: string;
};

export function EasterEggModal({
  open,
  egg,
  onClose,
}: {
  open: boolean;
  egg?: EasterEggPayload;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && egg ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Easter egg ${egg.id}`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-label="Cerrar"
          />
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-lg"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="flex items-start justify-between gap-3 p-5">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-[color:var(--love-300)]">
                  <span className="text-[color:var(--accent)]">EE</span>
                  <span>{egg.id}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
                  {egg.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[color:var(--foreground)] hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 pb-5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-[color:var(--foreground)]/90">
                {egg.placeholder}
              </div>
              <p className="mt-3 text-xs text-[color:var(--foreground)]/60">
                Placeholder: aquí luego pones tu texto lindo.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

