"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { capitulos, intro, pie, secretos, type EggId } from "@/content/historia";
import { discover, discoveredStore, isDiscovered } from "@/lib/discoveries";
import { chime, pop } from "@/lib/sound";
import { ChapterSection } from "../ChapterSection";
import { DialogueBox, type DialogueContent } from "../DialogueBox";
import { Hotbar } from "../Hotbar";
import { PixelScene, type ThemeId } from "../PixelScene";
import { PixelSprite } from "../pixel/PixelSprite";

const ALL: EggId[] = [1, 2, 3, 4, 5, 6, 7];

/** The original timeline, now a place inside the universe. */
export function HistoriaPlace() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(capitulos[0].id);
  const [dialogue, setDialogue] = useState<DialogueContent | null>(null);
  const [lastFound, setLastFound] = useState<EggId | null>(null);
  const discovered = discoveredStore.useValue();
  const found = ALL.filter((n) => discovered.includes(`secreto-${n}`));

  const theme: ThemeId = capitulos.find((c) => c.id === activeId)?.tema ?? "love";

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (e.target.id === "fin") {
            setActiveId("fin");
            discover("historia-fin");
          } else setActiveId(e.target.id);
        }
      },
      { root, rootMargin: "-48% 0px -48% 0px" },
    );
    for (const n of nodes) io.observe(n);
    return () => io.disconnect();
  }, []);

  const findEgg = useCallback((id: EggId) => {
    const s = secretos[id];
    const already = isDiscovered(`secreto-${id}`);
    if (already) pop();
    else {
      discover(`secreto-${id}`);
      setLastFound(id);
      chime();
    }
    setDialogue({
      etiqueta: already ? `Secreto ${id} de 7` : `¡Encontraste el secreto ${id} de 7!`,
      titulo: s.titulo,
      texto: s.texto,
      sprite: s.sprite,
    });
  }, []);

  return (
    <>
      <PixelScene themeId={activeId === "fin" ? "love" : theme} scrollContainer={scrollRef} />
      <div ref={scrollRef} className="place-scroll absolute inset-0 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-[1020px] px-4 pb-44 pt-6">
          <motion.header
            className="on-scene mx-auto mb-16 max-w-xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="signboard frame-wood inline-block px-8 py-3 text-ink">
              <h2 className="text-3xl md:text-4xl">{intro.titulo}</h2>
            </div>
            <p className="mt-5 text-xl text-cream">{intro.subtitulo}</p>
            <p className="mt-3 text-lg leading-relaxed text-cream/75">{intro.texto}</p>
            <p className="mt-6 inline-flex items-center gap-2 text-base text-gold">
              <PixelSprite name="sparkle" scale={3} className="star-pulse" />
              Hay 7 secretos en esta historia.
              <PixelSprite name="sparkle" scale={3} className="star-pulse" style={{ animationDelay: "0.6s" }} />
            </p>
          </motion.header>

          <div className="relative">
            <div aria-hidden="true" className="trail absolute bottom-24 left-[23px] top-10 hidden sm:block" />
            {capitulos.map((c, i) => (
              <ChapterSection
                key={c.id}
                capitulo={c}
                index={i}
                active={activeId === c.id}
                found={found}
                onFind={findEgg}
              />
            ))}
          </div>

          <footer id="fin" data-scene className="on-scene relative mt-10 flex flex-col items-center text-center">
            <PixelSprite name="heart" scale={9} className="anim-late drop-shadow-[0_0_24px_rgba(255,93,143,0.55)]" />
            <h2 className="mt-8 text-4xl text-cream md:text-5xl">{pie.titulo}</h2>
            <p className="mt-3 text-xl text-cream/80">{pie.texto}</p>
            <p className="mt-10 text-sm text-cream/50">{pie.firma}</p>
          </footer>
        </div>
      </div>

      <Hotbar visible={!dialogue} found={found} lastFound={lastFound} onSelect={findEgg} />
      <DialogueBox content={dialogue} onClose={() => setDialogue(null)} />
    </>
  );
}
