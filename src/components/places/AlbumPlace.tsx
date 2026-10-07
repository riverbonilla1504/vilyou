"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { categorias, descubrimientos, TOTAL, type Categoria, type Descubrimiento } from "@/content/descubrimientos";
import { discoveredStore } from "@/lib/discoveries";
import { pop } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { DialogueBox, type DialogueContent } from "../DialogueBox";
import { PixelSprite } from "../pixel/PixelSprite";
import { HiddenNote } from "@/components/HiddenNote";
import { HiddenPinky } from "@/components/Sorpresas";

const order = Object.keys(categorias) as Categoria[];

/** The collection: everything found and everything still hidden. */
export function AlbumPlace() {
  const found = discoveredStore.useValue();
  const [dialogue, setDialogue] = useState<DialogueContent | null>(null);
  const count = found.length;

  const show = (d: Descubrimiento) => {
    pop();
    const isFound = found.includes(d.id);
    setDialogue({
      etiqueta: isFound ? categorias[d.categoria].nombre : "Todavía no lo encuentras…",
      titulo: isFound ? d.titulo : `??? · ${categorias[d.categoria].nombre}`,
      texto: isFound ? d.texto : `Pista: ${d.pista}`,
      sprite: isFound ? d.sprite : "sparkle",
    });
  };

  return (
    <div className="relative mx-auto max-w-[720px] pt-4">
      <HiddenNote spot="album" className="-left-1 bottom-2" />
      <HiddenPinky spot="album" className="-right-1 top-1" />
      <div className="frame-wood paper-texture px-4 py-4 text-ink">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm text-ink-soft">Llevas</div>
            <div className="text-3xl leading-none">
              {count} <span className="text-lg text-ink-soft">de {TOTAL} cositas</span>
            </div>
          </div>
          <PixelSprite name="heart" scale={3} className="anim-late" />
        </div>
        <div className="progress mt-3">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(count / TOTAL) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {count === TOTAL
            ? "¡Lo encontraste todo! Eres increíble."
            : `Te faltan ${TOTAL - count}. Toca un espacio vacío para ver una pista.`}
        </p>
      </div>

      {order.map((cat) => {
        const items = descubrimientos.filter((d) => d.categoria === cat);
        const n = items.filter((d) => found.includes(d.id)).length;
        return (
          <section key={cat} className="mt-6">
            <div className="flex items-center gap-2 px-1">
              <PixelSprite name={categorias[cat].sprite} scale={2} className="max-h-6" />
              <h3 className="on-scene text-lg text-cream">{categorias[cat].nombre}</h3>
              <span className="ml-auto font-press text-[10px] text-cream/70">
                {n}/{items.length}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1.5 sm:grid-cols-8">
              {items.map((d) => {
                const isFound = found.includes(d.id);
                return (
                  <motion.button
                    key={d.id}
                    type="button"
                    onClick={() => show(d)}
                    whileTap={{ scale: 0.9 }}
                    className={cn("slot relative grid aspect-square place-items-center", isFound && "slot-found")}
                    aria-label={isFound ? d.titulo : "Sin descubrir"}
                  >
                    <PixelSprite
                      name={d.sprite}
                      scale={2}
                      className={cn("max-h-[62%] max-w-[70%]", !isFound && "silhouette")}
                    />
                  </motion.button>
                );
              })}
            </div>
          </section>
        );
      })}

      <DialogueBox content={dialogue} onClose={() => setDialogue(null)} />
    </div>
  );
}
