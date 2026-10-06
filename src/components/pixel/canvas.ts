import { sprites, type SpriteName } from "./sprites";

/** Draws a sprite onto a canvas (for three.js textures and canvas animations). */
export function spriteCanvas(name: SpriteName, scale = 8, palette?: Record<string, string>, pad = 0) {
  const sprite = sprites[name];
  const colors: Record<string, string> = { ...sprite.palette, ...palette };
  const w = sprite.grid[0].length;
  const h = sprite.grid.length;
  const canvas = document.createElement("canvas");
  canvas.width = (w + pad * 2) * scale;
  canvas.height = (h + pad * 2) * scale;
  const g = canvas.getContext("2d")!;
  sprite.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === ".") continue;
      g.fillStyle = colors[ch];
      g.fillRect((x + pad) * scale, (y + pad) * scale, scale, scale);
    }
  });
  return canvas;
}

/** The pixel font that next/font generated (its family name is hashed). */
export function pixelFontFamily() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-pixelify").trim();
  return v || "sans-serif";
}
