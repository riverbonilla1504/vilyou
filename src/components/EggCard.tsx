"use client";

import { motion } from "framer-motion";
import { secretos, type EggId } from "@/content/historia";
import { cn } from "@/lib/utils";
import { PixelSprite } from "./pixel/PixelSprite";

/** A clickable item hiding one of the 7 secrets. */
export function EggCard({ id, found, onFind }: { id: EggId; found: boolean; onFind: (id: EggId) => void }) {
  const s = secretos[id];

  return (
    <motion.button
      type="button"
      onClick={() => onFind(id)}
      className={cn("card-inset egg-card group flex w-full items-center gap-3 p-2.5 text-left sm:gap-4 sm:p-3", found && "is-found")}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      aria-label={found ? `Secreto ${id}: ${s.titulo}` : `Secreto ${id}: ${s.pista}`}
    >
      <span className={cn("slot relative grid h-14 w-14 shrink-0 place-items-center sm:h-[68px] sm:w-[68px]", found && "slot-found")}>
        <span className={`anim-${s.animacion}`}>
          <PixelSprite name={s.sprite} scale={3} className="max-h-[38px] max-w-[44px] sm:max-h-[46px] sm:max-w-[52px]" />
        </span>
        <span className="egg-shine" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-lg leading-tight text-ink">{found ? s.titulo : `Secreto ${id}`}</span>
        <span className="mt-0.5 block text-sm text-ink-soft">{found ? "Encontrado ♥ tócalo para releer" : s.pista}</span>
      </span>

      <span
        className={cn(
          "egg-tag shrink-0 px-2 py-1 font-press text-[9px]",
          found ? "bg-[#6fbf5a] text-white" : "bg-rose text-white",
        )}
      >
        {found ? "✓" : "?"}
      </span>
    </motion.button>
  );
}
