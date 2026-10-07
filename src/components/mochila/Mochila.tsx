"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import { mochila } from "@/content/mochila";
import { mochilaSeenStore, mochilaStore, type MochilaView } from "@/lib/mochila";
import { pop } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { PixelSprite } from "../pixel/PixelSprite";
import type { SpriteName } from "../pixel/sprites";
import { Coupons } from "./Coupons";
import { FinalAchievement, useEverythingFound } from "./FinalAchievement";
import { PhotoBooth } from "./PhotoBooth";
import { PixelMap } from "./PixelMap";
import { SealedLetters } from "./SealedLetters";

const items: { id: Exclude<MochilaView, "menu">; sprite: SpriteName; label: string }[] = [
  { id: "cartas", sprite: "envelope", label: mochila.cartas },
  { id: "cupones", sprite: "chest", label: mochila.cupones },
  { id: "fotos", sprite: "camera", label: mochila.fotos },
  { id: "mapa", sprite: "mapIcon", label: mochila.mapa },
  { id: "logro", sprite: "trophy", label: mochila.logro },
];

const titles: Record<MochilaView, string> = {
  menu: mochila.titulo,
  cartas: mochila.cartas,
  cupones: mochila.cupones,
  fotos: mochila.fotos,
  mapa: mochila.mapa,
  logro: mochila.logro,
};

/** The backpack button (top-right of the universe). */
export function MochilaButton({ className }: { className?: string }) {
  const seen = mochilaSeenStore.useValue();
  return (
    <button
      type="button"
      onClick={() => {
        pop();
        mochilaSeenStore.set(true);
        mochilaStore.set("menu");
      }}
      className={cn("relative grid h-11 w-11 place-items-center", className)}
      aria-label={mochila.titulo}
    >
      <span className="slot absolute inset-0" aria-hidden="true" />
      <PixelSprite name="backpack" scale={2} className="relative" />
      {!seen ? <span className="mochila-new absolute -right-1.5 -top-1.5 z-10 h-4 w-4 rounded-full" /> : null}
    </button>
  );
}

/** The backpack itself: a Stardew-style inventory with the new surprises. */
export function Mochila() {
  const view = mochilaStore.useValue();
  return (
    <AnimatePresence>
      {view ? (
        <motion.div
          key="mochila"
          className="fixed inset-0 z-[63] flex items-end justify-center bg-[#0b0618]/70 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={titles[view]}
            className="frame-wood paper-texture relative flex max-h-[92dvh] w-full max-w-[560px] flex-col text-ink"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <header className="flex items-center gap-2 px-3 pt-3">
              {view !== "menu" ? (
                <button
                  type="button"
                  onClick={() => {
                    pop();
                    mochilaStore.set("menu");
                  }}
                  className="slot grid h-11 w-11 place-items-center"
                  aria-label="Volver a la mochila"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={3} />
                </button>
              ) : (
                <span className="grid h-11 w-11 place-items-center">
                  <PixelSprite name="backpack" scale={2} />
                </span>
              )}
              <h2 className="min-w-0 flex-1 truncate text-2xl leading-none">{titles[view]}</h2>
              <button
                type="button"
                onClick={() => {
                  pop();
                  mochilaStore.set(null);
                }}
                className="slot grid h-11 w-11 place-items-center"
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" strokeWidth={3} />
              </button>
            </header>

            <div className="mochila-body flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
              {view === "menu" ? (
                <Menu />
              ) : view === "cartas" ? (
                <SealedLetters />
              ) : view === "cupones" ? (
                <Coupons />
              ) : view === "fotos" ? (
                <PhotoBooth />
              ) : view === "mapa" ? (
                <PixelMap />
              ) : (
                <FinalAchievement inline />
              )}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Menu() {
  const { done } = useEverythingFound();
  return (
    <div className="grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3">
      {items.map((it, i) => {
        const locked = it.id === "logro" && !done;
        return (
          <motion.button
            key={it.id}
            type="button"
            onClick={() => {
              pop();
              mochilaStore.set(it.id);
            }}
            className={cn("slot flex flex-col items-center gap-2 px-2 py-4", !locked && "slot-found")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PixelSprite name={it.sprite} scale={3} className={locked ? "opacity-40 grayscale" : undefined} />
            <span className="text-center text-base leading-tight">{it.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
