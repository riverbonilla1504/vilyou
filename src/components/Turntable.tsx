"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { dedicada, textosMusica } from "@/content/musica";
import { musicStore, next, playSong, previous, progress, seek, swipedStore, toggle, turntableStore } from "@/lib/music";
import { pop, scratch } from "@/lib/sound";
import { TOTAL_CANCIONES, useSongs } from "@/lib/songs";
import { useRecordSpin } from "@/lib/useRecordSpin";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";

const isSpinning = () => {
  const m = musicStore.get();
  return m.playing && m.audible;
};

/** A record on its platter, with the tonearm. Spins with the music. */
export function Deck({
  scale = 6,
  spin = isSpinning,
  className,
  onTap,
}: {
  scale?: number;
  spin?: () => boolean;
  className?: string;
  onTap?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const flick = useRecordSpin(ref, spin);
  const size = 26 * scale;

  return (
    <motion.button
      type="button"
      className={cn("deck relative grid shrink-0 place-items-center touch-pan-y", className)}
      style={{ width: size + 28, height: size + 28 }}
      whileTap={{ scale: 0.96 }}
      onTap={onTap}
      onPanEnd={(_, info) => {
        if (Math.abs(info.offset.x) < 40 && Math.abs(info.velocity.x) < 350) return;
        flick(info.offset.x > 0 ? 1 : -1);
        scratch();
        swipedStore.set(true);
        next();
      }}
      aria-label="Disco: toca para pausar o seguir, deslízalo para cambiar de canción"
    >
      <span className="deck-platter absolute inset-2 rounded-full" />
      <div ref={ref} className="relative will-change-transform">
        <PixelSprite name="vinyl" scale={scale} className="block" />
      </div>
      <span className="record-shine pointer-events-none absolute inset-[14px]" />
      <PixelSprite
        name="tonearm"
        scale={Math.max(2, Math.round(scale * 0.6))}
        className="pointer-events-none absolute -right-1 top-0"
      />
    </motion.button>
  );
}

/** Small round button that opens the turntable (top-left on the sky screens). */
export function TurntableButton({ className }: { className?: string }) {
  const { count } = useSongs();
  const music = musicStore.useValue();
  return (
    <motion.button
      type="button"
      onClick={() => {
        pop();
        turntableStore.set(true);
      }}
      className={cn("relative grid h-12 w-12 place-items-center", className)}
      aria-label={`${textosMusica.tocadiscos}: ${count} de ${TOTAL_CANCIONES} canciones`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 16 }}
    >
      {/* the slot is clipped for its pixel corners, so the badge sits outside it */}
      <span className="slot absolute inset-0" aria-hidden="true" />
      <PixelSprite
        name="vinyl"
        scale={1.4}
        className={cn("relative", music.playing && music.audible && "anim-spin")}
      />
      <motion.span
        key={count}
        className="count-badge absolute -bottom-2 -right-2 z-10 min-w-[22px] px-1 text-center font-press text-[9px] leading-[18px]"
        initial={{ scale: 1.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
      >
        {count}
      </motion.span>
    </motion.button>
  );
}

/** Fixed in the top-left corner of the sky screens (countdown and letter). */
export function TurntableFab() {
  return (
    <div className="turntable-fab pointer-events-auto fixed left-3 z-40">
      <TurntableButton />
    </div>
  );
}

/** The record collection: what plays now, controls, and every song (found or not). */
export function TurntablePanel() {
  const open = turntableStore.useValue();
  return <AnimatePresence>{open ? <Panel key="panel" /> : null}</AnimatePresence>;
}

function Panel() {
  const music = musicStore.useValue();
  const { list, open, count } = useSongs();
  const [pos, setPos] = useState({ current: 0, duration: 0 });
  const close = () => {
    pop();
    turntableStore.set(false);
  };

  useEffect(() => {
    const id = window.setInterval(() => setPos(progress()), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && turntableStore.set(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const playing = music.playing && music.audible;
  const track = music.track;
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <motion.div
      className="fixed inset-0 z-[66] flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <button type="button" aria-label="Cerrar" className="absolute inset-0 bg-[#0b0618]/65" onClick={close} />

      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={textosMusica.tocadiscos}
        className="frame-wood paper-texture relative flex max-h-[90dvh] w-full max-w-[520px] flex-col text-ink sm:max-h-[86dvh]"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        <header className="flex items-center gap-3 px-4 pt-3">
          <PixelSprite name="note" scale={3} />
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl leading-none">{textosMusica.tocadiscos}</h2>
            <p className="mt-1 font-press text-[9px] text-ink-soft">
              {count}/{TOTAL_CANCIONES} canciones
            </p>
          </div>
          <button type="button" onClick={close} className="slot grid h-11 w-11 place-items-center" aria-label="Cerrar">
            <X className="h-6 w-6" strokeWidth={3} />
          </button>
        </header>

        {/* the player */}
        <div className="deck-box mx-3 mt-3 flex items-center gap-3 p-3">
          <Deck scale={4} onTap={() => track && toggle()} />
          <div className="min-w-0 flex-1 text-cream">
            {track ? (
              <>
                <div className="truncate text-lg leading-tight">{track.titulo}</div>
                <div className="truncate text-sm text-cream/70">{track.artista}</div>
                <button
                  type="button"
                  className="progress mt-2 block h-3 w-full"
                  aria-label="Posición de la canción"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    seek((e.clientX - r.left) / r.width);
                  }}
                >
                  <span
                    className="progress-fill block h-full"
                    style={{ width: `${pos.duration ? (pos.current / pos.duration) * 100 : 0}%` }}
                  />
                </button>
                <div className="mt-1 flex justify-between font-press text-[8px] text-cream/60">
                  <span>{mmss(pos.current)}</span>
                  <span>{pos.duration ? mmss(pos.duration) : "--:--"}</span>
                </div>
              </>
            ) : (
              <p className="text-base leading-snug text-cream/85">
                {count ? "Elige una canción ♥" : "Todavía no tienes canciones… prueba tocar la luna ♥"}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                className="btn-pixel grid h-10 w-10 place-items-center"
                aria-label="Anterior"
                disabled={!track}
                onClick={() => {
                  pop();
                  previous();
                }}
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="btn-pixel btn-rose grid h-11 w-12 place-items-center"
                aria-label={playing ? "Pausar" : "Reproducir"}
                disabled={!count}
                onClick={() => toggle()}
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button
                type="button"
                className="btn-pixel grid h-10 w-10 place-items-center"
                aria-label="Siguiente"
                disabled={!count}
                onClick={() => {
                  scratch();
                  next();
                }}
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <p className="px-4 pt-2 text-center text-xs text-ink-soft">{textosMusica.deslizar}</p>

        {!open ? (
          <div className="mx-3 mt-2 bg-[#ffe3ef] px-3 py-2 text-center text-sm leading-snug text-rose-dark shadow-[inset_0_0_0_2px_#d8406f]">
            {textosMusica.adelanto}
          </div>
        ) : null}

        {/* the collection */}
        <ul className="mt-2 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(14px,env(safe-area-inset-bottom))]">
          {list.map(({ song, unlocked, hint }) => {
            const current = track?.id === song.id;
            return (
              <li key={song.id}>
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => {
                    pop();
                    if (current) toggle();
                    else playSong(song);
                  }}
                  className={cn(
                    "song-row flex w-full items-center gap-3 px-2 py-2 text-left",
                    current && "song-row-current",
                    !unlocked && "opacity-75",
                  )}
                >
                  <span className={cn("slot grid h-10 w-10 shrink-0 place-items-center", unlocked && "slot-found")}>
                    {unlocked ? (
                      current && playing ? (
                        <span className="eq" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        <PixelSprite name="note" scale={2} />
                      )
                    ) : (
                      <Lock className="h-4 w-4 text-ink-soft" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base leading-tight">
                      {unlocked ? song.titulo : "???"}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">
                      {unlocked
                        ? song.artista
                        : open || song.id === dedicada.id
                          ? `${song.artista} · ${hint}`
                          : `${song.artista} · se desbloquea pronto`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.section>
    </motion.div>
  );
}
