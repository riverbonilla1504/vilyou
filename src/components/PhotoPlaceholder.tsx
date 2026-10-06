import { ImageIcon } from "lucide-react";

export function PhotoPlaceholder({
  label = "Tu foto aquí",
}: {
  label?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-md">
      <div className="aspect-[16/10] w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <ImageIcon className="h-6 w-6 text-[color:var(--love-300)]" />
        </div>
        <div className="text-sm font-semibold text-[color:var(--foreground)]/90">
          {label}
        </div>
        <div className="text-xs text-[color:var(--foreground)]/55">
          Reemplázame por tu foto después
        </div>
      </div>
    </div>
  );
}

