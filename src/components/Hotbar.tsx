"use client";

import { motion } from "framer-motion";
import { secretos, type EggId } from "@/content/historia";
import { ALL_EGGS } from "@/lib/eggs";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";

/** The inventory toolbar at the bottom: one slot per secret. */
export function Hotbar({
  visible,
  found,
  lastFound,
  onSelect,
}: {
  visible: boolean;
  found: EggId[];
  lastFound: EggId | null;
  onSelect: (id: EggId) => void;
}) {
  return (
    <motion.nav
      aria-label="Secretos encontrados"
      className="safe-bottom fixed left-1/2 z-30 -translate-x-1/2"
      initial={false}
      animate={visible ? { y: 0, opacity: 1 } : { y: 140, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="frame-wood hotbar relative flex items-center gap-1 sm:gap-1.5">
        {ALL_EGGS.map((id) => {
          const isFound = found.includes(id);
          const s = secretos[id];
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => isFound && onSelect(id)}
              disabled={!isFound}
              title={isFound ? s.titulo : "Secreto sin descubrir"}
              aria-label={isFound ? `Secreto ${id}: ${s.titulo}` : `Secreto ${id}: sin descubrir`}
              className={cn(
                "slot hotbar-slot relative grid place-items-center",
                isFound ? "cursor-pointer hover:brightness-105" : "cursor-default",
              )}
              animate={lastFound === id ? { scale: [1, 1.4, 0.9, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={isFound ? { y: -3 } : undefined}
            >
              <span className="absolute left-[5px] top-[4px] font-press text-[6px] text-ink-soft sm:text-[7px]">
                {id}
              </span>
              <PixelSprite
                name={s.sprite}
                scale={2}
                className={cn("max-h-[70%] max-w-[78%]", !isFound && "silhouette")}
              />
            </motion.button>
          );
        })}

        <div className="hotbar-count absolute -top-6 right-1 flex items-center gap-1 px-2 py-0.5 font-press text-[9px] text-cream sm:-right-3 sm:text-[10px]">
          <PixelSprite name="heartSmall" scale={2} />
          {found.length}/7
        </div>
      </div>
    </motion.nav>
  );
}
