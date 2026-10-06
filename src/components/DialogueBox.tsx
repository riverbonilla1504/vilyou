"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTypewriter } from "@/lib/useTypewriter";
import { PixelSprite } from "./pixel/PixelSprite";
import type { SpriteName } from "./pixel/sprites";

export type DialogueContent = {
  etiqueta: string;
  titulo: string;
  texto: string;
  sprite: SpriteName;
};

const pixelSteps = (n: number) => (t: number) => Math.min(1, Math.ceil(t * n) / n);

/** A Stardew-style dialogue box with a portrait, anchored to the bottom. */
export function DialogueBox({ content, onClose }: { content: DialogueContent | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {content ? <Dialogue key={content.titulo + content.texto} content={content} onClose={onClose} /> : null}
    </AnimatePresence>
  );
}

function Dialogue({ content, onClose }: { content: DialogueContent; onClose: () => void }) {
  const { shown, done, skip } = useTypewriter(content.texto.length, { cps: 46 });
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (done) onClose();
        else skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, onClose, skip]);

  const advance = () => (done ? onClose() : skip());

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-4 sm:px-6 sm:pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#0b0618]/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar"
        tabIndex={-1}
      />

      <motion.div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label={content.titulo}
        tabIndex={-1}
        onClick={advance}
        className="relative grid w-full max-w-[880px] cursor-pointer grid-cols-1 gap-3 outline-none sm:grid-cols-[1fr_210px]"
        initial={{ y: 60, scaleY: 0.15, opacity: 0 }}
        animate={{ y: 0, scaleY: 1, opacity: 1 }}
        exit={{ y: 40, scaleY: 0.2, opacity: 0 }}
        transition={{ duration: 0.35, ease: pixelSteps(6) }}
        style={{ originY: 1 }}
      >
        <div className="frame-wood paper-texture relative min-h-[190px] px-4 pb-8 pt-3 text-ink sm:px-6 sm:pt-4">
          <div className="flex items-center gap-3">
            <span className="slot grid h-12 w-12 shrink-0 place-items-center sm:hidden">
              <PixelSprite name={content.sprite} scale={2} />
            </span>
            <div className="min-w-0">
              <div className="text-sm text-rose-dark sm:text-base">{content.etiqueta}</div>
              <div className="text-lg sm:hidden">{content.titulo}</div>
            </div>
          </div>

          <p className="sr-only">{content.texto}</p>
          <p aria-hidden="true" className="mt-3 text-xl leading-[1.55] sm:text-[22px]">
            {content.texto.slice(0, shown)}
            <span className="opacity-0">{content.texto.slice(shown)}</span>
          </p>

          {done ? <span className="blink absolute bottom-2 right-4 text-xl text-rose-dark">▼</span> : null}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center text-ink-soft hover:text-ink"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden flex-col items-stretch gap-2 sm:flex">
          <div className="frame-wood portrait grid aspect-square place-items-center">
            <motion.div
              initial={{ scale: 0.4, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.15 }}
            >
              <PixelSprite name={content.sprite} scale={6} className="anim-flota max-h-[120px] max-w-[130px]" />
            </motion.div>
          </div>
          <div className="nameplate px-2 py-1 text-center text-base">{content.titulo}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
