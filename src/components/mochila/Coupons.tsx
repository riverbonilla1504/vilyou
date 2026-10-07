"use client";

import { motion } from "framer-motion";
import { cupones, textosCupones } from "@/content/cupones";
import { queueNext } from "@/lib/music";
import { cuponesStore } from "@/lib/mochila";
import { achieve, cancionPorId } from "@/lib/songs";
import { premios, type Premio } from "@/content/musica";
import { pop, swoosh } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { PixelSprite } from "../pixel/PixelSprite";

const fmt = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });

/** 7 love coupons: flip one to read it (and win a song), then redeem it with River. */
export function Coupons() {
  const { leidos, canjeados } = cuponesStore.useValue();

  return (
    <div className="pb-2">
      <p className="mb-3 text-center text-sm text-ink-soft">{textosCupones.ayuda}</p>
      <div className="grid gap-3">
        {cupones.map((c, i) => {
          const read = leidos.includes(i);
          const used = canjeados[i];
          return (
            <motion.div
              key={i}
              className="coupon-flip relative h-[128px]"
              initial={false}
              animate={{ rotateX: read ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* front: closed ticket */}
              <button
                type="button"
                onClick={() => {
                  swoosh();
                  cuponesStore.set((s) => (s.leidos.includes(i) ? s : { ...s, leidos: [...s.leidos, i] }));
                  const key = `cupon-${i + 1}` as Premio;
                  if (key in premios && achieve(key)) {
                    const song = cancionPorId[premios[key]];
                    if (song) queueNext(song);
                  }
                }}
                className="coupon coupon-front absolute inset-0 flex items-center gap-4 px-4"
                style={{ backfaceVisibility: "hidden" }}
                aria-label={`Cupón ${i + 1}`}
              >
                <PixelSprite name="ticket" scale={4} />
                <span className="text-left">
                  <span className="block font-press text-[10px] text-rose-dark">CUPÓN Nº {i + 1}</span>
                  <span className="mt-1 block text-lg leading-tight">Toca para voltearlo ♥</span>
                </span>
              </button>

              {/* back: what it's worth */}
              <div
                className={cn("coupon coupon-back absolute inset-0 flex flex-col justify-center px-4 py-3", used && "coupon-used")}
                style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-lg leading-tight text-rose-dark">{c.titulo}</span>
                  <span className="font-press text-[9px] text-ink-soft">Nº {i + 1}</span>
                </div>
                <p className="mt-1 text-base leading-snug">{c.texto}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-ink-soft">{used ? `${textosCupones.canjeado} · ${used}` : textosCupones.comoCanjear}</span>
                  {!used ? (
                    <button
                      type="button"
                      className="btn-pixel btn-rose shrink-0 px-3 py-1 text-sm"
                      onClick={() => {
                        pop();
                        cuponesStore.set((s) => ({ ...s, canjeados: { ...s.canjeados, [i]: fmt.format(new Date()) } }));
                      }}
                    >
                      {textosCupones.canjear}
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
