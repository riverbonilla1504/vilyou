"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useRef, useState } from "react";
import { peluches } from "@/content/lugares";
import { discover, isDiscovered } from "@/lib/discoveries";
import { bleat, meow, pop, purr } from "@/lib/sound";
import { PixelSprite } from "../pixel/PixelSprite";
import type { SpriteName } from "../pixel/sprites";

type Who = keyof typeof peluches;

const cast: { who: Who; sprite: SpriteName; name: string; scale: number }[] = [
  { who: "pinky", sprite: "pinky", name: "Pinky", scale: 7 },
  { who: "melody", sprite: "melody", name: "Melody", scale: 6 },
  { who: "cody", sprite: "cody", name: "Cody", scale: 6 },
  { who: "mia", sprite: "cat", name: "Mía", scale: 6 },
];

/** Pinky, Melody, Cody and Mía, each with their own little reaction. */
export function PlushiesPlace() {
  const [bubble, setBubble] = useState<{ who: Who; text: string; key: number } | null>(null);
  const lineIndex = useRef<Record<Who, number>>({ pinky: 0, melody: 0, cody: 0, mia: 0 });
  const miaPets = useRef(0);
  const keyRef = useRef(0);
  const [hearts, setHearts] = useState<{ who: Who; key: number } | null>(null);

  const say = (who: Who) => {
    const lines = peluches[who];
    const text = lines[lineIndex.current[who] % lines.length];
    lineIndex.current[who]++;
    keyRef.current += 1;
    setBubble({ who, text, key: keyRef.current });
    setHearts({ who, key: keyRef.current });
  };

  const checkFamily = () => {
    if (["pinky", "melody", "cody", "mia"].every((id) => isDiscovered(id))) discover("familia");
  };

  return (
    <div className="plush-room absolute inset-0 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex min-h-full max-w-[560px] flex-col justify-center px-4 pb-10 pt-20">
        <p className="on-scene text-center text-base text-cream/85">Toca a cada uno ♥</p>
        <div className="shelf mt-10 grid grid-cols-2 gap-x-4 gap-y-16">
          {cast.map((c) => (
            <Plush
              key={c.who}
              {...c}
              bubble={bubble?.who === c.who ? bubble : null}
              hearts={hearts?.who === c.who ? hearts.key : null}
              onTap={(controls) => {
                say(c.who);
                if (c.who === "pinky") {
                  pop();
                  void controls.start({ scaleY: [1, 0.72, 1.12, 1], scaleX: [1, 1.25, 0.92, 1], transition: { duration: 0.5 } });
                  discover("pinky");
                } else if (c.who === "melody") {
                  pop();
                  void controls.start({ rotate: [0, -12, 12, -6, 0], transition: { duration: 0.6 } });
                  discover("melody");
                } else if (c.who === "cody") {
                  bleat();
                  void controls
                    .start({ x: ["0vw", "110vw"], transition: { duration: 0.7, ease: "easeIn" } })
                    .then(() => controls.set({ x: "-110vw" }))
                    .then(() => controls.start({ x: "0vw", transition: { duration: 0.9, delay: 0.8, ease: "easeOut" } }));
                  discover("cody");
                } else {
                  meow();
                  miaPets.current++;
                  void controls.start({ y: [0, -14, 0], transition: { duration: 0.4 } });
                  discover("mia");
                  if (miaPets.current === 7) {
                    window.setTimeout(purr, 400);
                    keyRef.current += 1;
                    setBubble({ who: "mia", text: "Prrrrr… (te ama)", key: keyRef.current });
                    discover("mia-ronroneo");
                  }
                }
                checkFamily();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Plush({
  who,
  sprite,
  name,
  scale,
  bubble,
  hearts,
  onTap,
}: {
  who: Who;
  sprite: SpriteName;
  name: string;
  scale: number;
  bubble: { text: string; key: number } | null;
  hearts: number | null;
  onTap: (controls: ReturnType<typeof useAnimationControls>) => void;
}) {
  const controls = useAnimationControls();

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {bubble ? (
          <motion.div
            key={bubble.key}
            className="speech absolute -top-12 z-10 max-w-[170px] px-2.5 py-1 text-center text-sm leading-snug"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {bubble.text}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => onTap(controls)}
        animate={controls}
        className="relative grid h-[120px] place-items-end"
        aria-label={name}
      >
        <span className="anim-flota block" style={{ animationDelay: `${who.length * 0.2}s` }}>
          <PixelSprite name={sprite} scale={scale} />
        </span>
        <AnimatePresence>
          {hearts ? (
            <motion.span key={hearts} className="pointer-events-none absolute inset-0">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/3"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: (i - 1) * 30, y: -60 - i * 10, opacity: 0 }}
                  transition={{ duration: 1, delay: i * 0.08 }}
                >
                  <PixelSprite name="heartSmall" scale={3} />
                </motion.span>
              ))}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.button>
      <div className="nameplate mt-2 px-3 py-0.5 text-base">{name}</div>
    </div>
  );
}
