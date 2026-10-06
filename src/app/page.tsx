"use client";

import { MotionConfig, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BloomTransition } from "@/components/BloomTransition";
import { DiscoveryToast } from "@/components/DiscoveryToast";
import { LockScreen } from "@/components/LockScreen";
import { PixelScene } from "@/components/PixelScene";
import { RetroLetter } from "@/components/RetroLetter";
import { TapBursts } from "@/components/TapBursts";
import { PixelSprite } from "@/components/pixel/PixelSprite";
import { UniverseScreen } from "@/components/universe/UniverseScreen";
import { config, localTime } from "@/content/config";
import { useIsPast } from "@/lib/clock";
import { discover } from "@/lib/discoveries";
import { progressStore, useFlags, visitsStore } from "@/lib/flags";
import { soundStore } from "@/lib/sound";

export default function Home() {
  const flags = useFlags();
  const unlockAt = flags.forceLockUntil ?? localTime(config.desbloqueo);
  const past = useIsPast(unlockAt);
  const [entered, setEntered] = useState(false);
  const [sawLock, setSawLock] = useState(false);

  if (past === null) return <Splash />;

  const locked = flags.forceLockUntil ? !past : !flags.preview && !past;
  if (locked && !sawLock) setSawLock(true);

  if (locked || (sawLock && !entered)) {
    return (
      <MotionConfig reducedMotion="user">
        <LockScreen unlockAt={unlockAt} ready={past} onEnter={() => setEntered(true)} />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <Experience />
    </MotionConfig>
  );
}

function Splash() {
  return (
    <div className="screen grid place-items-center bg-night">
      <PixelSprite name="heart" scale={5} className="anim-late" />
    </div>
  );
}

function Experience() {
  const [screen, setScreen] = useState<"carta" | "universo">(() =>
    progressStore.get().cartaLeida ? "universo" : "carta",
  );
  const [blooming, setBlooming] = useState(false);

  useEffect(() => {
    discover("hola");
    const d = new Date();
    if (d.getMinutes() === 7 && (d.getHours() === 7 || d.getHours() === 19)) discover("hora-707");
    if (d.getHours() < 5) discover("madrugada");
    if (d.getDate() === 7) discover("dia-7");
    const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    visitsStore.set((v) => (v.includes(today) ? v : [...v, today]));
    if (visitsStore.get().length >= 2) discover("volviste");
  }, []);

  // Load the sound setting early so the first tap already knows it.
  soundStore.useValue();

  return (
    <>
      {screen === "carta" ? (
        <main className="relative isolate overflow-x-clip">
          <PixelScene themeId="carta" interactive />
          <TapBursts />
          <section className="pointer-events-none relative flex min-h-[100svh] flex-col items-center justify-center px-4 pb-16 pt-20">
            <motion.p
              className="on-scene mb-6 text-center font-press text-[10px] text-cream/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {config.inicialElla} ♥ {config.inicialYo} · {config.meses} meses
            </motion.p>
            <motion.p
              className="tap-chip on-scene mb-6 flex items-center gap-2 px-3 py-1.5 text-center text-sm text-cream"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <span className="tap-finger">👆</span>
              Toca todo: la luna, las nubes, las flores… todo tiene algo
            </motion.p>
            <div className="w-full">
              <RetroLetter onEnterUniverse={() => setBlooming(true)} />
            </div>
          </section>
        </main>
      ) : (
        <UniverseScreen />
      )}

      {blooming ? (
        <BloomTransition onCovered={() => setScreen("universo")} onDone={() => setBlooming(false)} />
      ) : null}
      <DiscoveryToast />
    </>
  );
}
