import Image from "next/image";
import { PixelSprite } from "./pixel/PixelSprite";

/** The photo itself, or a little night-sky placeholder until there is one. */
export function PhotoFace({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes="(max-width: 768px) 90vw, 420px" className="object-cover" />;
  }

  return (
    <div className="photo-placeholder absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
      <PixelSprite name="moon" scale={3} className="absolute right-[12%] top-[14%] opacity-90" />
      <PixelSprite name="sparkle" scale={2} className="absolute left-[16%] top-[20%] opacity-80" />
      <PixelSprite name="sparkle" scale={2} className="absolute left-[38%] top-[10%] opacity-60" />
      <PixelSprite name="heart" scale={3} className="anim-late" />
      <div className="text-lg text-cream">Tu foto aquí</div>
      <div className="text-xs text-cream/60">Ponla en public/fotos y escribe la ruta en historia.ts</div>
    </div>
  );
}

/** A framed picture hanging on the wall. */
export function PhotoFrame({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="photo-frame frame-wood relative transition-transform duration-300 hover:-rotate-1 hover:scale-[1.01]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1b1240]">
        <PhotoFace src={src} alt={alt} />
      </div>
    </div>
  );
}
