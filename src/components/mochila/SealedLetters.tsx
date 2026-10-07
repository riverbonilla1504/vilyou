"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cartasSelladas } from "@/content/cartasSelladas";
import { localTime } from "@/content/config";
import { splitDuration, useNow } from "@/lib/clock";
import { cartasStore } from "@/lib/mochila";
import { achieve } from "@/lib/songs";
import { chime, pop, swoosh } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { PixelSprite } from "../pixel/PixelSprite";

const fmt = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" });

/** Letters that open by themselves on their date. */
export function SealedLetters() {
  const now = useNow();
  const { leidas } = cartasStore.useValue();
  const [open, setOpen] = useState<number | null>(null);

  if (open !== null) return <Letter index={open} onBack={() => setOpen(null)} />;

  return (
    <div className="grid gap-3 pb-2">
      {cartasSelladas.map((c, i) => {
        const at = localTime(c.abre);
        const left = now ? at - now : Infinity;
        const ready = left <= 0;
        const read = leidas.includes(i);
        const { dias, horas, minutos } = splitDuration(left);
        return (
          <motion.button
            key={c.abre}
            type="button"
            disabled={!ready}
            onClick={() => {
              swoosh();
              setOpen(i);
              if (!read) {
                cartasStore.set((s) => ({ ...s, leidas: [...s.leidas, i] }));
                achieve("carta-sellada");
              }
            }}
            className={cn("slot flex items-center gap-3 px-3 py-3 text-left", ready && "slot-found")}
            whileTap={ready ? { scale: 0.97 } : undefined}
          >
            <span className="relative grid h-14 w-16 shrink-0 place-items-center">
              <PixelSprite name="envelope" scale={4} className={ready ? "anim-flota" : "opacity-70"} />
              {!ready ? (
                <PixelSprite name="shackle" scale={2} className="absolute -bottom-1 right-0" />
              ) : !read ? (
                <span className="mochila-new absolute -right-1 -top-1 h-4 w-4 rounded-full" />
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg leading-tight">{c.titulo}</span>
              <span className="block text-sm text-ink-soft">
                {ready
                  ? read
                    ? "Abierta ♥ tócala para releer"
                    : "¡Ya se puede abrir!"
                  : `Se abre el ${fmt.format(new Date(at))} · faltan ${dias} d ${horas} h ${minutos} min`}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function Letter({ index, onBack }: { index: number; onBack: () => void }) {
  const c = cartasSelladas[index];
  return (
    <AnimatePresence>
      <motion.article
        className="frame-paper paper-texture relative mb-2 px-5 pb-6 pt-6 text-ink [overflow-wrap:anywhere]"
        initial={{ scaleY: 0.05, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => chime()}
      >
        <header className="flex items-baseline justify-between text-sm text-ink-soft">
          <span>{c.titulo}</span>
          <span>{fmt.format(new Date(localTime(c.abre)))}</span>
        </header>
        <div className="dotted-rule mt-3" />
        <p className="mt-4 text-xl text-rose-dark">{c.saludo}</p>
        {c.parrafos.map((p, i) => (
          <motion.p
            key={i}
            className="mt-3 text-lg leading-[1.6]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.4 }}
          >
            {p}
          </motion.p>
        ))}
        <p className="mt-6 text-right text-xl text-rose-dark">{c.firma}</p>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="btn-pixel px-4 py-1.5 text-base"
            onClick={() => {
              pop();
              onBack();
            }}
          >
            Volver a las cartas
          </button>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}
