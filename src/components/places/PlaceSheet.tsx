"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** A full-screen "place" that opens over the universe. */
export function PlaceSheet({
  title,
  onClose,
  children,
  className,
  bare = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** The child manages its own scrolling and background. */
  bare?: boolean;
}) {
  return (
    <motion.section
      className={cn("place fixed inset-0 z-40 flex flex-col overflow-hidden", className)}
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ clipPath: "circle(0% at 50% 50%)", transition: { duration: 0.45, ease: [0.6, 0, 0.8, 0.4] } }}
      transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
      aria-label={title}
    >
      <header className="place-header pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-3">
        <button
          type="button"
          onClick={onClose}
          className="btn-pixel pointer-events-auto flex items-center gap-1 py-1.5 pl-2 pr-3 text-base"
        >
          <ChevronLeft className="h-5 w-5" />
          Universo
        </button>
        <h2 className="on-scene truncate text-xl text-cream">{title}</h2>
      </header>

      {bare ? (
        children
      ) : (
        <div className="place-scroll relative flex-1 overflow-y-auto overscroll-contain px-4 pb-16">{children}</div>
      )}
    </motion.section>
  );
}
