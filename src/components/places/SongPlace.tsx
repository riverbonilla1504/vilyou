"use client";

import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { config } from "@/content/config";
import { nuestra } from "@/content/musica";
import { discover } from "@/lib/discoveries";
import { musicStore, playSong, toggle } from "@/lib/music";
import { findSong } from "@/lib/songs";
import { pop } from "@/lib/sound";
import { useTypewriter } from "@/lib/useTypewriter";
import { PixelSprite } from "../pixel/PixelSprite";
import { Deck } from "../Turntable";

const ourSongSpinning = () => {
  const m = musicStore.get();
  return m.track?.id === nuestra.id && m.playing && m.audible;
};

/** Our song: a record that plays it, and the dedication. */
export function SongPlace() {
  const { cancion } = config;
  const music = musicStore.useValue();
  const [reading, setReading] = useState(false);
  const { shown } = useTypewriter(cancion.dedicatoria.length, { active: reading, cps: 34 });
  const ours = music.track?.id === nuestra.id;
  const playing = ours && music.playing && music.audible;

  const play = () => {
    findSong(nuestra.id);
    if (ours) toggle();
    else playSong(nuestra);
  };

  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center pt-4 text-center">
      <div className="relative">
        <Deck scale={7} spin={ourSongSpinning} onTap={play} />
        {playing
          ? [0, 1, 2].map((i) => (
              <PixelSprite
                key={i}
                name="note"
                scale={3}
                className="note-float pointer-events-none absolute"
                style={{ left: `${10 + i * 38}%`, top: "-6%", animationDelay: `${i * 0.9}s` }}
              />
            ))
          : null}
      </div>

      <h3 className="on-scene mt-5 text-2xl text-cream">{nuestra.titulo}</h3>
      <p className="on-scene text-base text-cream/75">{nuestra.artista}</p>

      <motion.button
        type="button"
        className="btn-pixel btn-rose mt-4 px-5 py-2 text-lg"
        whileTap={{ scale: 0.96 }}
        onClick={play}
      >
        <span className="flex items-center gap-2">
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {playing ? "Pausar" : "Ponla en el disco ♪"}
        </span>
      </motion.button>

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
