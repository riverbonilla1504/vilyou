import { sprites, type SpriteName } from "./sprites";

type Run = { x: number; y: number; w: number; color: string };

const cache = new Map<string, Run[]>();

function runsFor(name: SpriteName, palette?: Record<string, string>) {
  const key = palette ? `${name}:${JSON.stringify(palette)}` : name;
  const hit = cache.get(key);
  if (hit) return hit;

  const sprite = sprites[name];
  const colors = { ...sprite.palette, ...palette };
  const runs: Run[] = [];
  sprite.grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w++;
      if (ch !== ".") runs.push({ x, y, w, color: colors[ch] });
      x += w;
    }
  });
  cache.set(key, runs);
  return runs;
}

export function spriteSize(name: SpriteName) {
  const { grid } = sprites[name];
  return { w: grid[0].length, h: grid.length };
}

export function PixelSprite({
  name,
  scale = 4,
  palette,
  className,
  style,
  title,
}: {
  name: SpriteName;
  /** Screen pixels per sprite pixel. Overridden by CSS width/height. */
  scale?: number;
  palette?: Record<string, string>;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}) {
  const { w, h } = spriteSize(name);
  const runs = runsFor(name, palette);

  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.color} />
      ))}
    </svg>
  );
}
