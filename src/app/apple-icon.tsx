import { ImageResponse } from "next/og";
import { sprites } from "@/components/pixel/sprites";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the pixel heart on a night sky. */
export default function AppleIcon() {
  const { grid, palette } = sprites.heart;
  const cell = 10;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #13143d 0%, #43287a 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {grid.map((row, y) => (
            <div key={y} style={{ display: "flex" }}>
              {row.split("").map((ch, x) => (
                <div
                  key={x}
                  style={{
                    width: cell,
                    height: cell,
                    background: ch === "." ? "transparent" : (palette as Record<string, string>)[ch],
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
