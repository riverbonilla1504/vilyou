"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TOTAL } from "@/content/descubrimientos";
import { planetas, universoTextos } from "@/content/lugares";
import { fotosUniverso } from "@/content/universo";
import { discover, discoveredStore } from "@/lib/discoveries";
import { progressStore } from "@/lib/flags";
import { pop, soundStore } from "@/lib/sound";
import { DialogueBox, type DialogueContent } from "../DialogueBox";
import { PixelScene } from "../PixelScene";
import { PixelSprite } from "../pixel/PixelSprite";
import { RetroLetter } from "../RetroLetter";
import { TurntableButton } from "../Turntable";
import { BottleLetter, HiddenPinky, HugOverlay, NameInStars, NightMode, onHugDone } from "../Sorpresas";
import { MochilaButton } from "../mochila/Mochila";
import { avisoCartaNueva, cartasSelladas } from "@/content/cartasSelladas";
import { localTime } from "@/content/config";
import { mochila } from "@/content/mochila";
import { cartasStore, mochilaSeenStore } from "@/lib/mochila";
import { say } from "@/lib/speech";
import { momentoDelDia, useMinute } from "@/lib/timeOfDay";
import { AlbumPlace } from "../places/AlbumPlace";
import { CakePlace } from "../places/CakePlace";
import { GamesPlace } from "../places/GamesPlace";
import { GardenPlace } from "../places/GardenPlace";
import { HistoriaPlace } from "../places/HistoriaPlace";
import { PlaceSheet } from "../places/PlaceSheet";
import { PlushiesPlace } from "../places/PlushiesPlace";
import { SongPlace } from "../places/SongPlace";
import { UniverseCanvas, type PlaceId } from "./UniverseCanvas";

type Open = PlaceId | "album" | null;

const titles: Record<Exclude<Open, null>, string> = { ...planetas, album: "Álbum de cositas" };

export function UniverseScreen() {
  const discovered = discoveredStore.useValue();
  const soundOn = soundStore.useValue();
  const [open, setOpen] = useState<Open>(null);
  const [photo, setPhoto] = useState<number | null>(null);
  const [help, setHelp] = useState(true);
  const [beat, setBeat] = useState(0);
  const [welcome, setWelcome] = useState<DialogueContent | null>(() =>
    progressStore.get().universo
      ? null
      : { etiqueta: universoTextos.subtitulo, titulo: universoTextos.titulo, texto: universoTextos.bienvenida, sprite: "heart" },
  );

  useEffect(() => {
    const t = window.setTimeout(() => setHelp(false), 9000);
    return () => window.clearTimeout(t);
  }, []);

  // The phone's back gesture closes the open place.
  useEffect(() => {
    const onPop = () => setOpen(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openPlace = useCallback((id: Exclude<Open, null>) => {
    setOpen(id);
    window.history.pushState({ vilyouPlace: id }, "");
    discover(id === "album" ? "album" : `lugar-${id}`);
  }, []);

  const close = useCallback(() => {
    pop();
    if (window.history.state?.vilyouPlace) window.history.back();
    else setOpen(null);
  }, []);

  // Dev-only shortcut for testing places without the camera flight.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as { __vilyou?: unknown }).__vilyou = { open: openPlace };
  }, [openPlace]);

  const found = discovered.length;
  const [hug, setHug] = useState(-1);
  const [hugDone, setHugDone] = useState(false);
  const [bottle, setBottle] = useState(false);
  const [nameStars, setNameStars] = useState(false);
  const moonTaps = useRef(0);
  const closeNameStars = useCallback(() => setNameStars(false), []);
  const minute = useMinute();
  const momento = minute ? momentoDelDia(minute) : "noche";

  // News from River: the backpack (first time) and sealed letters that just opened.
  useEffect(() => {
    if (welcome) return;
    const t = window.setTimeout(() => {
      if (!mochilaSeenStore.get()) {
        say(mochila.aviso);
        return;
      }
      const now = Date.now();
      const { avisadas, leidas } = cartasStore.get();
      const nueva = cartasSelladas.findIndex(
        (c, i) => localTime(c.abre) <= now && !avisadas.includes(i) && !leidas.includes(i),
      );
      if (nueva >= 0) {
        cartasStore.set((s) => ({ ...s, avisadas: [...s.avisadas, nueva] }));
        say(avisoCartaNueva);
      }
    }, 2500);
    return () => window.clearTimeout(t);
  }, [welcome]);

  return (
    <div className={`screen universe universe-${momento} relative overflow-hidden`}>
      <UniverseCanvas
        paused={open !== null}
        discovered={discovered}
        onPlace={openPlace}
        onDiscover={(id) => {
          // Seven taps on the moon spell her name in the stars.
          if (id === "luna-universo") {
            moonTaps.current += 1;
            if (moonTaps.current % 7 === 0) setNameStars(true);
          }
          discover(id);
        }}
        onPhoto={setPhoto}
        onHeart={(n) => {
          pop();
          setBeat(n);
        }}
        onHug={(p) => {
          setHugDone(false);
          setHug(p);
        }}
        onHugDone={() => {
          setHug(-1);
          setHugDone(true);
          onHugDone();
          window.setTimeout(() => setHugDone(false), 2600);
        }}
        onBottle={() => {
          pop();
          setBottle(true);
        }}
      />

      <NightMode enabled={!welcome} />
      <HiddenPinky spot="universo" className="bottom-[150px] left-[5%]" />
      <HugOverlay progress={hug} done={hugDone} />
      <BottleLetter open={bottle} onClose={() => setBottle(false)} />
      <NameInStars show={nameStars} onDone={closeNameStars} />

      {/* HUD */}
      <div className="universe-top pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-3">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setHelp((h) => !h)}
            className="slot pointer-events-auto grid h-11 w-11 place-items-center text-ink"
            aria-label="Ayuda"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <TurntableButton className="pointer-events-auto h-11 w-11" />
        </div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="universe-title text-2xl leading-none text-cream sm:text-3xl">{universoTextos.titulo}</h1>
          <p className="mt-1 font-press text-[10px] text-rose-light">{universoTextos.subtitulo}</p>
        </motion.div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              soundStore.set((v) => !v);
              pop();
            }}
            className="slot pointer-events-auto grid h-11 w-11 place-items-center text-ink"
            aria-pressed={soundOn}
            aria-label={soundOn ? "Silenciar sonidos" : "Activar sonidos"}
          >
            {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 opacity-60" />}
          </button>
          <MochilaButton className="pointer-events-auto" />
        </div>
      </div>

      <AnimatePresence>
        {beat > 0 && beat < 7 ? (
          <motion.div
            key={beat}
            className="pointer-events-none absolute left-1/2 top-[44%] z-10 -translate-x-1/2 font-press text-sm text-rose-light"
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -50, scale: 1.2 }}
            transition={{ duration: 0.9 }}
          >
            ♥ {beat}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="universe-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-4">
        <AnimatePresence>
          {help ? (
            <motion.p
              className="on-scene max-w-xs text-center text-sm leading-snug text-cream/85"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {universoTextos.ayuda}
            </motion.p>
          ) : null}
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={() => {
            pop();
            openPlace("album");
          }}
          className="frame-wood counter-pill pointer-events-auto flex items-center gap-3 px-3 py-1.5 text-ink"
          whileTap={{ scale: 0.95 }}
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 240, damping: 20 }}
        >
          <PixelSprite name="sparkle" scale={3} className="star-pulse" />
          <span className="text-left">
            <span className="block text-xs text-ink-soft">Descubrimientos</span>
            <span className="block font-press text-sm">
              {found}/{TOTAL}
            </span>
          </span>
          <span className="progress w-20">
            <span className="progress-fill block" style={{ width: `${(found / TOTAL) * 100}%` }} />
          </span>
        </motion.button>
      </div>

      {/* photo viewer */}
      <AnimatePresence>
        {photo !== null && fotosUniverso[photo] ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0618]/70 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPhoto(null)}
          >
            <motion.figure
              className="polaroid relative max-w-[340px]"
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: -2 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fotosUniverso[photo].src} alt="Nuestra foto" className="w-full" />
              <button type="button" className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-cream text-ink" aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* places */}
      <AnimatePresence>
        {open === "carta" ? (
          <PlaceSheet key="carta" title={titles.carta} onClose={close} bare>
            <PixelScene themeId="carta" />
            <div className="place-scroll place-pad absolute inset-0 overflow-y-auto overscroll-contain px-4 pb-16">
              <RetroLetter reread />
            </div>
            <HiddenPinky spot="carta" className="bottom-[5%] right-[3%]" />
          </PlaceSheet>
        ) : open === "jardin" ? (
          <PlaceSheet key="jardin" title={titles.jardin} onClose={close} bare className="garden-sheet">
            <GardenPlace />
          </PlaceSheet>
        ) : open === "historia" ? (
          <PlaceSheet key="historia" title={titles.historia} onClose={close} bare>
            <HistoriaPlace />
          </PlaceSheet>
        ) : open === "pastel" ? (
          <PlaceSheet key="pastel" title={titles.pastel} onClose={close} bare>
            <CakePlace />
          </PlaceSheet>
        ) : open === "juegos" ? (
          <PlaceSheet key="juegos" title={titles.juegos} onClose={close} className="games-sheet">
            <GamesPlace />
          </PlaceSheet>
        ) : open === "peluches" ? (
          <PlaceSheet key="peluches" title={titles.peluches} onClose={close} bare>
            <PlushiesPlace />
          </PlaceSheet>
        ) : open === "cancion" ? (
          <PlaceSheet key="cancion" title={titles.cancion} onClose={close} className="song-sheet">
            <SongPlace />
          </PlaceSheet>
        ) : open === "album" ? (
          <PlaceSheet key="album" title={titles.album} onClose={close} className="album-sheet">
            <AlbumPlace />
          </PlaceSheet>
        ) : null}
      </AnimatePresence>

      <DialogueBox
        content={open ? null : welcome}
        onClose={() => {
          setWelcome(null);
          progressStore.set((p) => ({ ...p, universo: true }));
        }}
      />
    </div>
  );
}
