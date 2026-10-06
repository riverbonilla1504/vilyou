"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { config } from "@/content/config";
import { discover } from "@/lib/discoveries";
import { pop } from "@/lib/sound";
import { useTypewriter } from "@/lib/useTypewriter";
import { PixelSprite } from "../pixel/PixelSprite";

function embedUrl(link: string) {
  const m = link.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : null;
}

/** Our song: a spinning record, the Spotify player and a dedication. */
export function SongPlace() {
  const { cancion } = config;
  const embed = embedUrl(cancion.spotify);
  const [reading, setReading] = useState(false);
  const { shown } = useTypewriter(cancion.dedicatoria.length, { active: reading, cps: 34 });

  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center pt-4 text-center">
      <div className="relative">
        <div className="record" />
        {[0, 1, 2].map((i) => (
          <PixelSprite
            key={i}
            name="note"
            scale={3}
            className="note-float absolute"
            style={{ left: `${10 + i * 38}%`, top: "-6%", animationDelay: `${i * 0.9}s` }}
          />
        ))}
      </div>

      <h3 className="on-scene mt-6 text-2xl text-cream">{cancion.titulo}</h3>
      <p className="on-scene text-base text-cream/75">{cancion.artista}</p>

      <div className="mt-5 w-full">
        {embed ? (
          <iframe
            title={cancion.titulo}
            src={embed}
            className="h-[152px] w-full rounded-xl"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        ) : (
          <div className="frame-paper px-4 py-3 text-sm text-ink-soft">
            Aquí aparecerá el reproductor cuando pongas el link de Spotify en <b>src/content/config.ts</b>.
          </div>
        )}
      </div>

      <div className="frame-paper paper-texture mt-6 w-full px-5 py-4 text-left text-ink">
        {reading ? (
          <p className="text-lg leading-relaxed">
            {cancion.dedicatoria.slice(0, shown)}
            <span className="opacity-0">{cancion.dedicatoria.slice(shown)}</span>
          </p>
        ) : (
          <motion.button
            type="button"
            className="btn-pixel btn-rose w-full px-4 py-2 text-lg"
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              pop();
              setReading(true);
              discover("cancion");
            }}
          >
            Leer la dedicatoria ♪
          </motion.button>
        )}
      </div>
    </div>
  );
}
