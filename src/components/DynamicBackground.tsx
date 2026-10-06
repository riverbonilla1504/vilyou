"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BackgroundThemeId =
  | "halloween"
  | "carnival"
  | "park"
  | "sunset"
  | "love";

export function DynamicBackground({ themeId }: { themeId: BackgroundThemeId }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[color:var(--background)]" />
      <AnimatePresence mode="wait">
        <motion.div
          key={themeId}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        >
          {themeId === "halloween" ? <HalloweenScene /> : null}
          {themeId === "carnival" ? <CarnivalScene /> : null}
          {themeId === "park" ? <ParkScene /> : null}
          {themeId === "sunset" ? <SunsetScene /> : null}
          {themeId === "love" ? <LoveScene /> : null}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />
    </div>
  );
}

function Floaty({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={cn("absolute rounded-full blur-2xl", className)}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -18, 0],
              x: [0, 10, 0],
              opacity: [0.55, 0.75, 0.55],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 8,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    />
  );
}

function SceneSvg({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      className={cn("absolute inset-0 h-full w-full", className)}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function HalloweenScene() {
  return (
    <div className="absolute inset-0">
      <SceneSvg className="opacity-90">
        <defs>
          <linearGradient id="h1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2a0b3a" />
            <stop offset="1" stopColor="#0b0614" />
          </linearGradient>
          <radialGradient id="moon" cx="75%" cy="20%" r="45%">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="1" />
            <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#h1)" />
        <circle cx="1080" cy="180" r="140" fill="url(#moon)" />
        <circle cx="1080" cy="180" r="62" fill="#fff3c4" opacity="0.95" />
        <path
          d="M0 700 C 220 620, 460 760, 720 690 C 980 620, 1160 740, 1440 670 L 1440 900 L 0 900 Z"
          fill="#0a0715"
          opacity="0.95"
        />
        <g opacity="0.9">
          <circle cx="260" cy="520" r="38" fill="#ff7a18" />
          <circle cx="255" cy="510" r="6" fill="#1b1025" />
          <circle cx="275" cy="510" r="6" fill="#1b1025" />
          <path d="M248 532 Q 260 545 282 532" stroke="#1b1025" strokeWidth="6" fill="none" />
        </g>
        <g opacity="0.85">
          <path
            d="M650 240 q30 18 60 0 q-18 26 10 40 q-30 8 -30 44 q-18 -24 -40 -12 q6 -26 -24 -40 q30 -8 24 -32 z"
            fill="#1c0f2a"
          />
          <path
            d="M820 300 q26 14 52 0 q-16 22 8 34 q-26 6 -26 36 q-16 -20 -34 -10 q5 -22 -20 -34 q26 -6 20 -26 z"
            fill="#1c0f2a"
          />
        </g>
      </SceneSvg>

      <Floaty className="left-[-120px] top-[10%] h-[380px] w-[380px] bg-[color:var(--secondary)]/30" />
      <Floaty
        className="right-[-140px] top-[45%] h-[420px] w-[420px] bg-[color:var(--accent)]/18"
        delay={1.2}
      />
    </div>
  );
}

function CarnivalScene() {
  return (
    <div className="absolute inset-0">
      <SceneSvg className="opacity-90">
        <defs>
          <linearGradient id="c1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2b0a2f" />
            <stop offset="1" stopColor="#0b1430" />
          </linearGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#c1)" />
        <g opacity="0.85">
          <circle cx="260" cy="220" r="78" fill="#ff6b9d" />
          <circle cx="390" cy="260" r="52" fill="#ffd54f" />
          <circle cx="1180" cy="230" r="70" fill="#42b883" />
          <circle cx="1040" cy="270" r="46" fill="#ce93d8" />
        </g>
        <g opacity="0.9">
          <path d="M0 130 L 1440 210" stroke="#ffb3c6" strokeWidth="10" />
          <path d="M0 160 L 1440 260" stroke="#ffd54f" strokeWidth="7" opacity="0.7" />
          <path d="M0 200 L 1440 310" stroke="#9c27b0" strokeWidth="6" opacity="0.6" />
        </g>
        <g opacity="0.85">
          {Array.from({ length: 44 }).map((_, i) => {
            const x = 60 + i * 32;
            const y = 120 + (i % 6) * 18;
            const r = 6 + (i % 4);
            const colors = ["#ff6b9d", "#ffd54f", "#ce93d8", "#42b883"];
            return <circle key={i} cx={x} cy={y} r={r} fill={colors[i % colors.length]} />;
          })}
        </g>
        <path
          d="M0 720 C 260 640, 520 800, 760 720 C 1020 630, 1220 780, 1440 700 L 1440 900 L 0 900 Z"
          fill="#0a0715"
          opacity="0.9"
        />
      </SceneSvg>

      <Floaty className="left-[-160px] top-[35%] h-[440px] w-[440px] bg-[color:var(--sunset-gold)]/12" />
      <Floaty
        className="right-[-140px] top-[8%] h-[360px] w-[360px] bg-[color:var(--accent)]/20"
        delay={0.8}
      />
    </div>
  );
}

function ParkScene() {
  return (
    <div className="absolute inset-0">
      <SceneSvg className="opacity-90">
        <defs>
          <linearGradient id="p1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0b1935" />
            <stop offset="1" stopColor="#150a22" />
          </linearGradient>
          <linearGradient id="mount" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2f2b63" />
            <stop offset="1" stopColor="#0e233b" />
          </linearGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#p1)" />
        <path d="M0 640 L 360 380 L 640 600 L 900 340 L 1440 640 L 1440 900 L 0 900 Z" fill="url(#mount)" />
        <path d="M0 700 L 420 480 L 720 700 L 980 460 L 1440 700 L 1440 900 L 0 900 Z" fill="#0a1a16" opacity="0.9" />
        <g opacity="0.9">
          <rect x="980" y="560" width="240" height="18" rx="9" fill="#2d1a2e" />
          <rect x="1040" y="520" width="12" height="40" rx="6" fill="#2d1a2e" />
          <rect x="1160" y="520" width="12" height="40" rx="6" fill="#2d1a2e" />
          <path d="M960 560 Q 1100 500 1240 560" stroke="#ffb3c6" strokeWidth="6" opacity="0.6" fill="none" />
        </g>
        <g opacity="0.85">
          <circle cx="220" cy="580" r="50" fill="#2a5f45" />
          <rect x="210" y="610" width="20" height="56" rx="10" fill="#1b2e22" />
          <circle cx="320" cy="610" r="36" fill="#2a5f45" />
          <rect x="310" y="634" width="20" height="52" rx="10" fill="#1b2e22" />
        </g>
      </SceneSvg>

      <Floaty className="left-[-120px] top-[15%] h-[380px] w-[380px] bg-[color:var(--purple-300)]/14" />
      <Floaty
        className="right-[-200px] top-[42%] h-[520px] w-[520px] bg-[color:var(--primary)]/12"
        delay={1}
      />
    </div>
  );
}

function SunsetScene() {
  return (
    <div className="absolute inset-0">
      <SceneSvg className="opacity-95">
        <defs>
          <linearGradient id="s1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#210a2a" />
            <stop offset="0.55" stopColor="#ff8a65" />
            <stop offset="1" stopColor="#0b0614" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="55%" r="40%">
            <stop offset="0" stopColor="#ffd54f" stopOpacity="1" />
            <stop offset="1" stopColor="#ffd54f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#s1)" />
        <circle cx="720" cy="520" r="240" fill="url(#sun)" />
        <circle cx="720" cy="560" r="92" fill="#ffd54f" opacity="0.9" />
        <path d="M0 650 C 240 610, 540 700, 720 660 C 920 615, 1180 705, 1440 655 L 1440 900 L 0 900 Z" fill="#090612" opacity="0.92" />
        <g opacity="0.6">
          <ellipse cx="360" cy="240" rx="160" ry="60" fill="#fff0f5" />
          <ellipse cx="460" cy="260" rx="120" ry="46" fill="#fff0f5" opacity="0.7" />
          <ellipse cx="1060" cy="230" rx="180" ry="66" fill="#fff0f5" opacity="0.55" />
        </g>
      </SceneSvg>

      <Floaty className="left-[-160px] top-[45%] h-[520px] w-[520px] bg-[color:var(--sunset-orange)]/14" />
      <Floaty
        className="right-[-140px] top-[12%] h-[400px] w-[400px] bg-[color:var(--love-300)]/16"
        delay={0.7}
      />
    </div>
  );
}

function LoveScene() {
  return (
    <div className="absolute inset-0">
      <SceneSvg className="opacity-95">
        <defs>
          <linearGradient id="l1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2a0b3a" />
            <stop offset="1" stopColor="#12061c" />
          </linearGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#l1)" />
        <g opacity="0.85">
          {Array.from({ length: 18 }).map((_, i) => {
            const x = 80 + i * 78;
            const y = 160 + (i % 5) * 56;
            const s = 18 + (i % 3) * 6;
            return (
              <path
                key={i}
                d={`M ${x} ${y} c 0 -${s} ${s} -${s} ${s} 0 c 0 ${s} -${s} ${s} -${s} ${2 *
                  s} c -${s} -${s} -${2 * s} -${s} -${2 * s} 0 c 0 -${s} ${s} -${s} ${s} 0 z`}
                fill={i % 2 === 0 ? "#ff6b9d" : "#ce93d8"}
                opacity={0.55}
              />
            );
          })}
        </g>
        <g opacity="0.9">
          <path
            d="M0 740 C 220 690, 520 820, 760 740 C 1000 660, 1220 820, 1440 730 L 1440 900 L 0 900 Z"
            fill="#0a0715"
          />
        </g>
        <g opacity="0.85">
          <circle cx="260" cy="720" r="30" fill="#ffb3c6" />
          <circle cx="1180" cy="730" r="26" fill="#ffb3c6" />
          <circle cx="340" cy="760" r="14" fill="#ffd54f" opacity="0.7" />
          <circle cx="1100" cy="770" r="12" fill="#ffd54f" opacity="0.7" />
        </g>
      </SceneSvg>

      <Floaty className="left-[-120px] top-[10%] h-[380px] w-[380px] bg-[color:var(--accent)]/18" />
      <Floaty
        className="right-[-220px] top-[40%] h-[560px] w-[560px] bg-[color:var(--secondary)]/16"
        delay={1.1}
      />
    </div>
  );
}

