import { PixelSprite } from "./pixel/PixelSprite";

const lights = ["#ff9a3c", "#c58cff", "#7fd6ff", "#6fe3a4", "#ff6f9a"];
const purpleHeart = { K: "#2a0f4a", R: "#b46cff", W: "#ead6ff", D: "#8a3fe0" };

/**
 * Their first Halloween, in pixel art: River as a sheikh and Valeria as
 * Little Red Riding Hood at a party. Takes the place of the chapter photo.
 */
export function HalloweenScene() {
  return (
    <div
      className="photo-frame frame-wood relative"
      role="img"
      aria-label="River vestido de jeque y Valeria de Caperucita Roja en una fiesta de Halloween"
    >
      <div className="halloween-party relative aspect-[4/3] w-full overflow-hidden">
        {/* string lights */}
        <svg className="absolute inset-x-0 top-0 h-[22%] w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M0 4 Q25 14 50 6 T100 5" stroke="#1a0d26" strokeWidth="0.8" fill="none" />
        </svg>
        {Array.from({ length: 11 }).map((_, i) => {
          const x = 4 + i * 9.2;
          const y = 4 + Math.sin((x / 100) * Math.PI * 2 + 0.6) * 3.2 + (x < 50 ? (x / 50) * 4 : 0);
          return (
            <span
              key={i}
              className="party-light absolute h-2 w-2"
              style={{ left: `${x}%`, top: `${y + 4}%`, background: lights[i % lights.length], animationDelay: `${i * 0.23}s` }}
            />
          );
        })}

        <PixelSprite name="moon" scale={3} className="absolute right-[7%] top-[16%] opacity-90" />
        <PixelSprite name="bat" scale={3} className="flyer" style={{ top: "26%", animationDuration: "14s" }} />
        <PixelSprite
          name="bat"
          scale={2}
          className="flyer"
          style={{ top: "18%", animationDuration: "19s", animationDelay: "-7s" }}
        />

        {/* floor */}
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[#2a1640] shadow-[inset_0_3px_0_#3d2158]" />

        <PixelSprite name="pumpkin" scale={4} className="anim-baila absolute bottom-[9%] left-[4%]" />
        <PixelSprite name="pumpkin" scale={3} className="absolute bottom-[10%] right-[5%]" />

        {/* the two of them */}
        <div className="absolute bottom-[8%] left-1/2 flex -translate-x-1/2 items-end gap-1">
          <PixelSprite name="sheikh" scale={4} className="block" />
          <PixelSprite name="heart" scale={2} palette={purpleHeart} className="anim-late mb-24 self-start" />
          <div className="relative">
            <PixelSprite name="caperucita" scale={4} className="block" />
            <PixelSprite name="basket" scale={3} className="absolute -right-5 bottom-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
