"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { config } from "@/content/config";
import { estacionFotos } from "@/content/mochila";
import { achieve } from "@/lib/songs";
import { chime, pop } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { pixelFontFamily, spriteCanvas } from "../pixel/canvas";
import { PixelSprite } from "../pixel/PixelSprite";
import type { SpriteName } from "../pixel/sprites";

type Sticker = { id: number; name: SpriteName; x: number; y: number; size: number };

const PALETTE: SpriteName[] = ["heart", "pinky", "cat", "tulip", "lily", "seven", "sparkle", "melody", "cody", "moon"];

/** Selfie with the front camera, pixel stickers on top, saved as a polaroid. */
export function PhotoBooth() {
  const video = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<boolean>(() => typeof navigator !== "undefined" && !navigator.mediaDevices);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1440 } }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (video.current) {
          video.current.srcObject = s;
          void video.current.play().catch(() => {});
        }
      })
      .catch(() => setError(true));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const add = (name: SpriteName) => {
    pop();
    const id = nextId.current++;
    setStickers((s) => [...s, { id, name, x: 0.5, y: 0.45, size: 0.22 }]);
    setSelected(id);
  };

  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    const box = stage.current?.getBoundingClientRect();
    if (!d || !box) return;
    const x = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width - d.dx));
    const y = Math.min(1, Math.max(0, (e.clientY - box.top) / box.height - d.dy));
    setStickers((s) => s.map((st) => (st.id === d.id ? { ...st, x, y } : st)));
  };

  const capture = async () => {
    const v = video.current;
    const live = !!v && v.videoWidth > 0;
    // Without a camera she can still make a sticker postcard on a night sky.
    if (!live && !error) return;
    const W = 900;
    const H = 1200;
    const M = 50;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H + 190;
    const g = c.getContext("2d")!;
    // polaroid paper
    g.fillStyle = "#fffaf2";
    g.fillRect(0, 0, c.width, c.height);
    // the photo (mirrored, like the preview), cropped to 3:4
    const iw = W - M * 2;
    const ih = H - M;
    if (live && v) {
      const s = Math.max(iw / v.videoWidth, ih / v.videoHeight);
      const sw = iw / s;
      const sh = ih / s;
      g.save();
      g.translate(M + iw, M);
      g.scale(-1, 1);
      g.drawImage(v, (v.videoWidth - sw) / 2, (v.videoHeight - sh) / 2, sw, sh, 0, 0, iw, ih);
      g.restore();
    } else {
      const sky = g.createLinearGradient(0, M, 0, M + ih);
      sky.addColorStop(0, "#120a2e");
      sky.addColorStop(0.6, "#3a1a5e");
      sky.addColorStop(1, "#7a2a6e");
      g.fillStyle = sky;
      g.fillRect(M, M, iw, ih);
      g.fillStyle = "#fff6d8";
      for (let i = 0; i < 70; i++) {
        const x = M + ((i * 137) % iw);
        const y = M + ((i * 89) % Math.floor(ih * 0.8));
        g.fillRect(x, y, i % 5 ? 4 : 8, i % 5 ? 4 : 8);
      }
    }
    // stickers, crisp
    g.imageSmoothingEnabled = false;
    for (const st of stickers) {
      const sc = spriteCanvas(st.name, 8);
      const w = st.size * iw;
      const h = (w * sc.height) / sc.width;
      g.drawImage(sc, M + st.x * iw - w / 2, M + st.y * ih - h / 2, w, h);
    }
    // caption
    g.fillStyle = "#6b4a3a";
    g.font = `64px ${pixelFontFamily()}`;
    g.textAlign = "center";
    const date = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
    g.fillText(`${config.inicialElla} ♥ ${config.inicialYo}`, W / 2, H + 75);
    g.font = `38px ${pixelFontFamily()}`;
    g.fillText(date, W / 2, H + 135);

    setFlash(true);
    window.setTimeout(() => setFlash(false), 250);
    chime();
    setShot(c.toDataURL("image/jpeg", 0.9));
    setSelected(null);
    achieve("fotos");
  };

  const save = async () => {
    if (!shot) return;
    pop();
    const blob = await (await fetch(shot)).blob();
    const file = new File([blob], `VILyou-${Date.now()}.jpg`, { type: "image/jpeg" });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: "VILyou ♥" });
        return;
      } catch {
        // She closed the share sheet.
        return;
      }
    }
    const a = document.createElement("a");
    a.href = shot;
    a.download = file.name;
    a.click();
  };


  if (shot) {
    return (
      <div className="flex flex-col items-center pb-2">
        <motion.img
          src={shot}
          alt="Nuestra foto"
          className="w-full max-w-[340px] shadow-[0_8px_0_rgb(14_6_24/0.3)]"
          initial={{ rotate: -6, scale: 0.85 }}
          animate={{ rotate: -2, scale: 1 }}
        />
        <div className="mt-4 flex gap-3">
          <button type="button" className="btn-pixel btn-rose px-5 py-2 text-lg" onClick={() => void save()}>
            {estacionFotos.guardar}
          </button>
          <button
            type="button"
            className="btn-pixel px-5 py-2 text-lg"
            onClick={() => {
              pop();
              setShot(null);
            }}
          >
            {estacionFotos.otra}
          </button>
        </div>
      </div>
    );
  }

  const sel = stickers.find((s) => s.id === selected);

  return (
    <div className="pb-2">
      <p className="mb-2 text-center text-sm text-ink-soft">{estacionFotos.ayuda}</p>
      <div className="polaroid mx-auto w-full max-w-[340px]">
        <div
          ref={stage}
          className="relative aspect-[3/4] w-full touch-none overflow-hidden bg-[#1b1240]"
          onPointerMove={move}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          {error ? (
            <div className="photo-fallback absolute inset-0 grid place-items-center px-6 text-center">
              <p className="text-sm text-cream/80">{estacionFotos.sinCamara}</p>
            </div>
          ) : (
            <video ref={video} playsInline muted className="absolute inset-0 h-full w-full -scale-x-100 object-cover" />
          )}
          {stickers.map((st) => (
            <div
              key={st.id}
              className={cn("absolute -translate-x-1/2 -translate-y-1/2 cursor-grab", st.id === selected && "sticker-selected")}
              style={{ left: `${st.x * 100}%`, top: `${st.y * 100}%`, width: `${st.size * 100}%` }}
              onPointerDown={(e) => {
                e.stopPropagation();
                const box = stage.current!.getBoundingClientRect();
                drag.current = {
                  id: st.id,
                  dx: (e.clientX - box.left) / box.width - st.x,
                  dy: (e.clientY - box.top) / box.height - st.y,
                };
                setSelected(st.id);
              }}
            >
              <PixelSprite name={st.name} scale={4} className="pointer-events-none block h-auto w-full" />
            </div>
          ))}
          {flash ? <div className="absolute inset-0 bg-white" /> : null}
        </div>
        <p className="mt-2 text-center text-lg text-ink">
          {config.inicialElla} ♥ {config.inicialYo}
        </p>
      </div>

      {sel ? (
        <div className="mt-2 flex justify-center gap-2">
          {[
            { icon: <Minus className="h-4 w-4" />, label: "Más pequeño", f: () => ({ size: Math.max(0.08, sel.size - 0.04) }) },
            { icon: <Plus className="h-4 w-4" />, label: "Más grande", f: () => ({ size: Math.min(0.6, sel.size + 0.04) }) },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={b.label}
              className="slot grid h-10 w-10 place-items-center"
              onClick={() => setStickers((s) => s.map((st) => (st.id === sel.id ? { ...st, ...b.f() } : st)))}
            >
              {b.icon}
            </button>
          ))}
          <button
            type="button"
            aria-label="Quitar sticker"
            className="slot grid h-10 w-10 place-items-center"
            onClick={() => {
              setStickers((s) => s.filter((st) => st.id !== sel.id));
              setSelected(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {PALETTE.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => add(name)}
            className="slot grid h-12 w-12 shrink-0 place-items-center"
            aria-label={`Sticker ${name}`}
          >
            <PixelSprite name={name} scale={2} className="max-h-9 max-w-10" />
          </button>
        ))}
      </div>

      <div className="mt-3 text-center">
        <button type="button" className="btn-pixel btn-rose px-6 py-2 text-lg" onClick={() => void capture()}>
          {estacionFotos.tomar}
        </button>
      </div>
    </div>
  );
}
