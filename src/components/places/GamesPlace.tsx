"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Delete } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { config } from "@/content/config";
import { discover } from "@/lib/discoveries";
import { buzz, chime, fanfare, pop } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { HeartConfetti } from "../HeartConfetti";
import { PixelSprite } from "../pixel/PixelSprite";
import type { SpriteName } from "../pixel/sprites";
import { HiddenNote } from "@/components/HiddenNote";

export function GamesPlace() {
  const [tab, setTab] = useState<"wordle" | "memoria">("wordle");
  return (
    <div className="relative mx-auto max-w-[520px] pt-3">
      <HiddenNote spot="juegos" className="-left-2 -top-1" />
      <div className="flex justify-center gap-2">
        {(
          [
            ["wordle", "Adivina mi corazón"],
            ["memoria", "Memoria"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              pop();
              setTab(id);
            }}
            className={cn("btn-pixel px-3 py-1.5 text-base", tab === id ? "btn-rose" : "opacity-80")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tab === "wordle" ? <Wordle /> : <Memory />}</div>
    </div>
  );
}

/* ────────────────────────────── Wordle ────────────────────────────── */

type Mark = "hit" | "near" | "miss";

function score(guess: string, answer: string): Mark[] {
  const res: Mark[] = Array(guess.length).fill("miss");
  const left: Record<string, number> = {};
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) res[i] = "hit";
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < guess.length; i++) {
    if (res[i] === "hit") continue;
    if (left[guess[i]]) {
      res[i] = "near";
      left[guess[i]]--;
    }
  }
  return res;
}

const ROWS = 6;
const KEYS = ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"];

function Wordle() {
  const answer = config.wordle.palabra.toUpperCase();
  const len = answer.length;
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [shake, setShake] = useState(0);
  const [hint, setHint] = useState(false);
  const won = guesses.includes(answer);
  const lost = !won && guesses.length >= ROWS;

  const type = (k: string) => {
      if (won || lost) return;
      if (k === "ENTER") {
        if (current.length < len) {
          buzz();
          setShake((s) => s + 1);
          return;
        }
        const next = [...guesses, current];
        setGuesses(next);
        setCurrent("");
        if (current === answer) {
          window.setTimeout(() => {
            fanfare();
            discover("wordle");
            if (next.length <= 3) discover("wordle-rapido");
          }, len * 180 + 200);
        } else pop();
        return;
      }
      if (k === "DEL") {
        setCurrent((c) => c.slice(0, -1));
        return;
      }
      if (current.length < len) {
        pop();
        setCurrent((c) => c + k);
      }
  };

  const typeRef = useRef(type);
  useEffect(() => {
    typeRef.current = type;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") typeRef.current("ENTER");
      else if (e.key === "Backspace") typeRef.current("DEL");
      else if (/^[a-zñ]$/i.test(e.key)) typeRef.current(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const keyState: Record<string, Mark> = {};
  for (const g of guesses) {
    score(g, answer).forEach((m, i) => {
      const prev = keyState[g[i]];
      if (prev === "hit" || (prev === "near" && m === "miss")) return;
      keyState[g[i]] = m;
    });
  }

  return (
    <div className="flex flex-col items-center">
      <p className="on-scene text-center text-base text-cream/85">
        Adivina la palabra secreta de {len} letras ({ROWS} intentos)
      </p>

      <div className="mt-3 grid gap-1.5">
        {Array.from({ length: ROWS }).map((_, r) => {
          const done = r < guesses.length;
          const word = done ? guesses[r] : r === guesses.length ? current : "";
          const marks = done ? score(guesses[r], answer) : null;
          return (
            <motion.div
              key={r === guesses.length ? `row-${r}-${shake}` : `row-${r}`}
              className="flex gap-1.5"
              animate={r === guesses.length && shake ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
              transition={{ duration: 0.35 }}
            >
              {Array.from({ length: len }).map((_, c) => (
                <motion.div
                  key={c}
                  className={cn("wordle-tile grid h-12 w-12 place-items-center font-press text-lg sm:h-14 sm:w-14", marks && `is-${marks[c]}`)}
                  initial={false}
                  animate={marks ? { rotateX: [0, 90, 0] } : word[c] ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.45, delay: marks ? c * 0.18 : 0 }}
                >
                  {word[c] ?? ""}
                </motion.div>
              ))}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 min-h-[52px] text-center">
        {won ? (
          <motion.p className="on-scene text-lg text-gold" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: len * 0.18 + 0.2 }}>
            {config.wordle.ganaste}
          </motion.p>
        ) : lost ? (
          <div>
            <p className="on-scene text-base text-cream">
              La palabra era <span className="text-gold">{answer}</span> ♥
            </p>
            <button
              type="button"
              className="btn-pixel mt-2 px-4 py-1.5"
              onClick={() => {
                setGuesses([]);
                setCurrent("");
              }}
            >
              Otra vez
            </button>
          </div>
        ) : hint ? (
          <p className="on-scene text-base text-cream/85">Pista: {config.wordle.pista}</p>
        ) : (
          <button type="button" className="text-sm text-cream/70 underline" onClick={() => setHint(true)}>
            ¿Una pista?
          </button>
        )}
      </div>

      <div className="mt-2 flex w-full flex-col items-center gap-1.5">
        {KEYS.map((row, i) => (
          <div key={row} className="flex w-full justify-center gap-1">
            {i === 2 ? (
              <Key wide onPress={() => type("ENTER")}>
                OK
              </Key>
            ) : null}
            {row.split("").map((k) => (
              <Key key={k} mark={keyState[k]} onPress={() => type(k)}>
                {k}
              </Key>
            ))}
            {i === 2 ? (
              <Key wide onPress={() => type("DEL")} label="Borrar">
                <Delete className="mx-auto h-4 w-4" />
              </Key>
            ) : null}
          </div>
        ))}
      </div>
      {won ? <HeartConfetti /> : null}
    </div>
  );
}

function Key({
  children,
  onPress,
  mark,
  wide,
  label,
}: {
  children: React.ReactNode;
  onPress: () => void;
  mark?: Mark;
  wide?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className={cn("wordle-key h-12 font-press text-[11px]", wide ? "w-[52px]" : "w-[30px] sm:w-9", mark && `is-${mark}`)}
    >
      {children}
    </button>
  );
}

/* ────────────────────────────── Memory ────────────────────────────── */

const pairs: { sprite: SpriteName; palette?: Record<string, string> }[] = [
  { sprite: "heart" },
  { sprite: "tulip" },
  { sprite: "lily" },
  { sprite: "cat" },
  { sprite: "pinky" },
  { sprite: "melody" },
  { sprite: "cody" },
  { sprite: "seven" },
];

type Card = { id: number; pair: number };

function shuffle(): Card[] {
  const cards = pairs.flatMap((_, i) => [
    { id: i * 2, pair: i },
    { id: i * 2 + 1, pair: i },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function Memory() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const busy = useRef(false);
  const complete = cards !== null && matched.length === pairs.length;

  const flip = (card: Card) => {
    if (busy.current || open.includes(card.id) || matched.includes(card.pair)) return;
    pop();
    const next = [...open, card.id];
    setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next.map((id) => cards!.find((c) => c.id === id)!);
    busy.current = true;
    if (a.pair === b.pair) {
      window.setTimeout(() => {
        chime();
        const done = [...matched, a.pair];
        setMatched(done);
        setOpen([]);
        busy.current = false;
        if (done.length === pairs.length) {
          fanfare();
          discover("memoria");
        }
      }, 350);
    } else {
      window.setTimeout(() => {
        setOpen([]);
        busy.current = false;
      }, 850);
    }
  };

  if (!cards) {
    return (
      <div className="flex flex-col items-center gap-4 pt-6 text-center">
        <p className="on-scene max-w-xs text-base text-cream/85">
          Encuentra las parejas: Mía, Pinky, Melody, Cody, tulipanes, lirios, nuestro 7 y un corazón.
        </p>
        <button
          type="button"
          className="btn-pixel btn-rose px-6 py-2.5 text-lg"
          onClick={() => {
            pop();
            setCards(shuffle());
          }}
        >
          Jugar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p className="on-scene text-sm text-cream/80">Movimientos: {moves}</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const up = open.includes(card.id) || matched.includes(card.pair);
          const p = pairs[card.pair];
          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => flip(card)}
              className="memory-card relative h-[78px] w-[70px] sm:h-[92px] sm:w-[82px]"
              animate={{ rotateY: up ? 180 : 0 }}
              transition={{ duration: 0.35 }}
              aria-label={up ? "Carta descubierta" : "Carta boca abajo"}
            >
              <span className="memory-face memory-back">
                <span className="font-press text-[10px] text-cream">
                  {config.inicialElla}♥{config.inicialYo}
                </span>
              </span>
              <span className={cn("memory-face memory-front", matched.includes(card.pair) && "is-matched")}>
                <PixelSprite name={p.sprite} scale={3} palette={p.palette} className="max-h-[70%] max-w-[78%]" />
              </span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {complete ? (
          <motion.div className="mt-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="on-scene text-lg text-gold">¡Todas! En {moves} movimientos ♥</p>
            <button
              type="button"
              className="btn-pixel mt-2 px-4 py-1.5"
              onClick={() => {
                setCards(shuffle());
                setMatched([]);
                setOpen([]);
                setMoves(0);
              }}
            >
              Otra vez
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {complete ? <HeartConfetti /> : null}
    </div>
  );
}
