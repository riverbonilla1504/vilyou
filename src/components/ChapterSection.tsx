"use client";

import { motion } from "framer-motion";
import type { Capitulo, EggId } from "@/content/historia";
import { discover } from "@/lib/discoveries";
import { pop } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { DragRevealPhoto } from "./DragRevealPhoto";
import { EggCard } from "./EggCard";
import { HalloweenScene } from "./HalloweenScene";
import { PhotoFrame } from "./PhotoFrame";
import { PixelSprite } from "./pixel/PixelSprite";
import { SevenStars } from "./SevenStars";

export function ChapterSection({
  capitulo,
  index,
  active,
  found,
  onFind,
}: {
  capitulo: Capitulo;
  index: number;
  active: boolean;
  found: EggId[];
  onFind: (id: EggId) => void;
}) {
  const c = capitulo;

  return (
    <section id={c.id} data-scene className="chapter relative pb-16 sm:pb-20 sm:pl-20">
      <div className="absolute left-1 top-1 hidden sm:block">
        <div className={cn("chapter-badge frame-wood grid place-items-center", active && "is-active")}>
          <span className="font-press text-xs text-ink sm:text-sm">{index + 1}</span>
        </div>
        <motion.div
          className="absolute -top-7 left-1/2 -translate-x-1/2"
          initial={false}
          animate={active ? { opacity: 1, y: [0, -6, 0] } : { opacity: 0, y: 6 }}
          transition={active ? { y: { duration: 1, repeat: Infinity, ease: "easeInOut" } } : { duration: 0.2 }}
        >
          <PixelSprite name="heartSmall" scale={3} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <div className="relative z-10 -mb-4 flex flex-wrap items-end gap-x-3 gap-y-2 pl-2 sm:pl-3">
          <motion.h2
            className="ribbon text-2xl md:text-3xl"
            initial={{ scaleX: 0.3, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
            style={{ originX: 0 }}
          >
            {c.titulo}
          </motion.h2>
          {c.etiqueta ? (
            <span className="chip mb-1 px-2.5 py-1 font-press text-[9px] text-ink sm:text-[10px]">{c.etiqueta}</span>
          ) : null}
          {c.tema === "halloween" ? (
            <motion.button
              type="button"
              className="ml-auto mr-2 self-start"
              onClick={() => {
                pop();
                discover("murcielago");
              }}
              animate={{ y: [0, -8, 0], x: [0, 6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              whileTap={{ x: 200, y: -120, opacity: 0, transition: { duration: 0.6 } }}
              aria-label="Murciélago"
            >
              <PixelSprite name="bat" scale={4} />
            </motion.button>
          ) : null}
        </div>

        <div className="chapter-panel frame-wood paper-texture relative px-4 pb-6 pt-8 text-ink sm:px-5 md:px-8 md:pb-8 md:pt-10">
          {c.tema === "halloween" ? (
            <button
              type="button"
              className="absolute -bottom-6 -right-3 z-10"
              onClick={() => {
                pop();
                discover("calabaza");
              }}
              aria-label="Calabaza"
            >
              <PixelSprite name="pumpkin" scale={4} className="anim-baila" />
            </button>
          ) : null}
          <p className="text-lg text-rose-dark md:text-xl">{c.subtitulo}</p>

          <div className="mt-5 grid gap-7 md:grid-cols-[1.05fr_1fr] md:gap-8">
            <motion.div
              className="space-y-4 text-lg leading-[1.6] md:text-[19px]"
              initial="hide"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.15, delayChildren: 0.25 }}
            >
              {c.parrafos.map((p, i) => (
                <motion.p
                  key={i}
                  variants={{ hide: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.45 }}
                >
                  {p}
                </motion.p>
              ))}
              {c.sieteEstrellas ? (
                <motion.div variants={{ hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                  <SevenStars />
                </motion.div>
              ) : null}
            </motion.div>

            <div className="space-y-4">
              {c.ilustracion === "halloween" ? (
                <HalloweenScene />
              ) : c.fotoConSecreto ? (
                <DragRevealPhoto
                  src={c.foto}
                  alt={c.titulo}
                  tall={c.fotoVertical}
                  position={c.fotoAjuste}
                  onRevealEgg={() => onFind(c.fotoConSecreto as EggId)}
                />
              ) : (
                <PhotoFrame src={c.foto} alt={c.titulo} tall={c.fotoVertical} position={c.fotoAjuste} />
              )}

              {c.fotosExtra?.length ? (
                <div className="grid grid-cols-2 gap-3">
                  {c.fotosExtra.map((src) => (
                    <PhotoFrame key={src} src={src} alt={c.titulo} />
                  ))}
                </div>
              ) : null}

              {c.secretos?.length ? (
                <motion.div
                  className="grid gap-3"
                  initial="hide"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ staggerChildren: 0.12 }}
                >
                  {c.secretos.map((id) => (
                    <motion.div
                      key={id}
                      variants={{ hide: { opacity: 0, y: 16, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } }}
                    >
                      <EggCard id={id} found={found.includes(id)} onFind={onFind} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
