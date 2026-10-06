"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { planetas } from "@/content/lugares";
import { fotosUniverso, frases } from "@/content/universo";
import { pixelFontFamily, spriteCanvas } from "../pixel/canvas";
import type { SpriteName } from "../pixel/sprites";

export type PlaceId = keyof typeof planetas;

type Props = {
  paused: boolean;
  discovered: string[];
  onPlace: (id: PlaceId) => void;
  onDiscover: (id: string) => void;
  onPhoto: (index: number) => void;
  onHeart: (taps: number) => void;
};

type PlanetDef = {
  id: PlaceId;
  sprite: SpriteName;
  a: string;
  b: string;
  rim: string;
  radius: number;
  orbit: number;
  height: number;
  angle: number;
  ring?: string;
};

const PLANETS: PlanetDef[] = [
  { id: "carta", sprite: "envelope", a: "#fff1d6", b: "#f2a46b", rim: "#fff6e6", radius: 1.2, orbit: 6.0, height: 7.0, angle: 0.3 },
  { id: "juegos", sprite: "gamepad", a: "#b9c4ff", b: "#5534d6", rim: "#8ff3ff", radius: 1.25, orbit: 7.0, height: 4.4, angle: 3.9 },
  { id: "jardin", sprite: "tulip", a: "#b6f0b9", b: "#2f8f68", rim: "#ffc2d9", radius: 1.4, orbit: 7.4, height: 1.8, angle: 1.2 },
  { id: "peluches", sprite: "pinky", a: "#e2b6ff", b: "#8a3fd1", rim: "#a5ff9a", radius: 1.45, orbit: 7.6, height: -1.0, angle: 4.8 },
  { id: "historia", sprite: "book", a: "#ffd98a", b: "#b0522c", rim: "#ffe6b0", radius: 1.3, orbit: 6.6, height: -3.6, angle: 2.1 },
  { id: "cancion", sprite: "note", a: "#8a9bff", b: "#1d1b52", rim: "#ff9ad1", radius: 1.2, orbit: 6.4, height: -6.0, angle: 5.6, ring: "#ffb3d9" },
  { id: "pastel", sprite: "cake", a: "#ffe0ec", b: "#ff6f9f", rim: "#ffffff", radius: 1.35, orbit: 7.6, height: -8.4, angle: 3.0 },
];

/** The camera looks a bit below the heart so the tall phone screen is filled. */
const HOME_Y = -1.6;

const coarse = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function gaussian(r: () => number) {
  return Math.sqrt(-2 * Math.log(Math.max(1e-6, r()))) * Math.cos(2 * Math.PI * r());
}

/* ------------------------------ textures ------------------------------ */

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function pixelTexture(name: SpriteName, palette?: Record<string, string>) {
  const t = new THREE.CanvasTexture(spriteCanvas(name, 8, palette, 1));
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  return t;
}

function wrap(g: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function textTexture(text: string, { color = "#fff4fa", glow = "#ff6fa8", size = 44, maxWidth = 520, plate = false } = {}) {
  const font = `${size}px ${pixelFontFamily()}`;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font;
  const lines = wrap(probe, text, maxWidth);
  const lineH = size * 1.25;
  const pad = plate ? 22 : 26;
  const w = Math.ceil(Math.max(...lines.map((l) => probe.measureText(l).width)) + pad * 2);
  const h = Math.ceil(lines.length * lineH + pad * 2);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  if (plate) {
    g.fillStyle = "rgba(20, 10, 40, 0.62)";
    g.beginPath();
    g.roundRect(4, 4, w - 8, h - 8, 18);
    g.fill();
    g.strokeStyle = "rgba(255, 220, 240, 0.55)";
    g.lineWidth = 3;
    g.stroke();
  }
  g.font = font;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = glow;
  g.shadowBlur = plate ? 8 : 18;
  g.fillStyle = color;
  lines.forEach((l, i) => g.fillText(l, w / 2, pad + lineH * (i + 0.5)));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return { texture: t, aspect: w / h, lines: lines.length };
}

/* ------------------------------ shaders ------------------------------ */

const pointsVertex = /* glsl */ `
  attribute float size;
  attribute float phase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = color;
    vTwinkle = 0.7 + 0.3 * sin(uTime * (1.2 + phase) + phase * 6.28);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uPixelRatio * (90.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.7) * vTwinkle;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

const planetVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const planetFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uRim;
  uniform float uTime;
  uniform float uSeed;
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec3 vView;
  void main() {
    vec3 p = normalize(vPos);
    float bands = sin(p.y * 9.0 + sin(p.x * 4.0 + uSeed) * 1.4 + uTime * 0.15) * 0.5 + 0.5;
    float t = clamp(p.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 base = mix(uB, uA, smoothstep(0.0, 1.0, t * 0.8 + bands * 0.25));
    vec3 light = normalize(vec3(0.5, 0.7, 0.6));
    float diff = clamp(dot(vNormal, light), 0.0, 1.0) * 0.55 + 0.55;
    float rim = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 2.4);
    vec3 col = base * diff + uRim * rim * 0.9;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ------------------------------ component ------------------------------ */

export function UniverseCanvas(props: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  const apiRef = useRef<{ setPaused: (p: boolean) => void; markFound: (ids: string[]) => void } | null>(null);

  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    apiRef.current?.setPaused(props.paused);
  }, [props.paused]);

  useEffect(() => {
    apiRef.current?.markFound(props.discovered);
  }, [props.discovered]);

  useEffect(() => {
    const mount = mountRef.current!;
    const mobile = coarse();
    const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 600);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 7;
    controls.maxDistance = 60;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI - 0.25;

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => {
      disposables.push(x);
      return x;
    };

    const glow = track(glowTexture());
    const uniforms = { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } };
    const pointsMaterial = track(
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );

    /* ---- galaxy ---- */
    const galaxy = new THREE.Group();
    galaxy.rotation.x = 0.18;
    scene.add(galaxy);
    {
      const r = rng(42);
      const count = mobile ? 14000 : 24000;
      const R = 17;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const size = new Float32Array(count);
      const phase = new Float32Array(count);
      const inner = new THREE.Color("#ffe0ef");
      const mid = new THREE.Color("#ff6fae");
      const outer = new THREE.Color("#7a63ff");
      const tmp = new THREE.Color();
      for (let i = 0; i < count; i++) {
        const arm = i % 3;
        const rad = Math.pow(r(), 0.75) * R;
        const spin = rad * 0.38;
        const spread = (1.4 - rad / R) * 0.9 + 0.25;
        const a = (arm / 3) * Math.PI * 2 + spin;
        pos[i * 3] = Math.cos(a) * rad + gaussian(r) * spread;
        pos[i * 3 + 1] = gaussian(r) * 0.35 * (1.2 - rad / R);
        pos[i * 3 + 2] = Math.sin(a) * rad + gaussian(r) * spread;
        const k = rad / R;
        if (k < 0.4) tmp.copy(inner).lerp(mid, k / 0.4);
        else tmp.copy(mid).lerp(outer, (k - 0.4) / 0.6);
        col[i * 3] = tmp.r;
        col[i * 3 + 1] = tmp.g;
        col[i * 3 + 2] = tmp.b;
        size[i] = 0.5 + r() * 1.6;
        phase[i] = r();
      }
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("size", new THREE.BufferAttribute(size, 1));
      geo.setAttribute("phase", new THREE.BufferAttribute(phase, 1));
      galaxy.add(new THREE.Points(geo, pointsMaterial));
    }

    /* ---- background stars ---- */
    {
      const r = rng(7);
      const count = 1600;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const size = new Float32Array(count);
      const phase = new Float32Array(count);
      const palette = ["#ffffff", "#ffd6ea", "#c9d4ff", "#fff1c4"].map((h) => new THREE.Color(h));
      for (let i = 0; i < count; i++) {
        const u = r() * 2 - 1;
        const th = r() * Math.PI * 2;
        const rad = 120 + r() * 120;
        const s = Math.sqrt(1 - u * u);
        pos[i * 3] = Math.cos(th) * s * rad;
        pos[i * 3 + 1] = u * rad;
        pos[i * 3 + 2] = Math.sin(th) * s * rad;
        const c = palette[i % palette.length];
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
        size[i] = 4 + r() * 6;
        phase[i] = r();
      }
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("size", new THREE.BufferAttribute(size, 1));
      geo.setAttribute("phase", new THREE.BufferAttribute(phase, 1));
      scene.add(new THREE.Points(geo, pointsMaterial));
    }

    /* ---- soft nebula glows ---- */
    const addGlow = (color: string, scale: number, pos: [number, number, number], opacity = 0.5) => {
      const m = track(
        new THREE.SpriteMaterial({ map: glow, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      const s = new THREE.Sprite(m);
      s.scale.setScalar(scale);
      s.position.set(...pos);
      scene.add(s);
      return s;
    };
    addGlow("#ff5d9e", 16, [0, 0, 0], 0.55);
    addGlow("#9b6bff", 30, [6, -1, -8], 0.22);
    addGlow("#5ab0ff", 26, [-9, 1, 6], 0.16);

    /* ---- heart ---- */
    const heart = new THREE.Group();
    scene.add(heart);
    {
      const r = rng(99);
      const count = mobile ? 2600 : 4200;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const size = new Float32Array(count);
      const phase = new Float32Array(count);
      const c1 = new THREE.Color("#ff2f7a");
      const c2 = new THREE.Color("#ffd1e6");
      const tmp = new THREE.Color();
      for (let i = 0; i < count; i++) {
        const t = r() * Math.PI * 2;
        const edge = r() < 0.55;
        const f = edge ? 0.96 + r() * 0.06 : Math.sqrt(r());
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        pos[i * 3] = x * f * 0.12;
        pos[i * 3 + 1] = y * f * 0.12 + 0.4;
        pos[i * 3 + 2] = gaussian(r) * 0.25 * (1 - f * 0.6);
        tmp.copy(c1).lerp(c2, edge ? r() * 0.4 : 0.3 + r() * 0.7);
        col[i * 3] = tmp.r;
        col[i * 3 + 1] = tmp.g;
        col[i * 3 + 2] = tmp.b;
        size[i] = edge ? 1.6 + r() * 1.6 : 0.8 + r() * 1.4;
        phase[i] = r();
      }
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("size", new THREE.BufferAttribute(size, 1));
      geo.setAttribute("phase", new THREE.BufferAttribute(phase, 1));
      heart.add(new THREE.Points(geo, pointsMaterial));
    }
    const heartGlow = addGlow("#ff3d86", 7, [0, 0.4, 0], 0.7);

    // a glowing ring around the heart
    const ring = new THREE.Group();
    scene.add(ring);
    {
      const r = rng(5);
      const count = 900;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const size = new Float32Array(count);
      const phase = new Float32Array(count);
      const c = new THREE.Color("#ffb3d4");
      for (let i = 0; i < count; i++) {
        const a = r() * Math.PI * 2;
        const rad = 3.3 + gaussian(r) * 0.12;
        pos[i * 3] = Math.cos(a) * rad;
        pos[i * 3 + 1] = gaussian(r) * 0.05;
        pos[i * 3 + 2] = Math.sin(a) * rad;
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
        size[i] = 0.6 + r() * 1.2;
        phase[i] = r();
      }
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("size", new THREE.BufferAttribute(size, 1));
      geo.setAttribute("phase", new THREE.BufferAttribute(phase, 1));
      ring.add(new THREE.Points(geo, pointsMaterial));
      ring.rotation.x = 1.2;
    }

    /* ---- interactive targets ---- */
    type Target = { object: THREE.Object3D; onTap: (hit: THREE.Intersection) => void };
    const targets: Target[] = [];
    const addTarget = (object: THREE.Object3D, onTap: Target["onTap"]) => targets.push({ object, onTap });

    const heartHit = new THREE.Mesh(
      track(new THREE.SphereGeometry(2.3, 12, 12)),
      track(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })),
    );
    heartHit.position.y = 0.3;
    scene.add(heartHit);
    let heartTaps = 0;
    let heartKick = 0;
    addTarget(heartHit, () => {
      heartTaps++;
      heartKick = 1;
      propsRef.current.onHeart(heartTaps);
      if (heartTaps === 7) propsRef.current.onDiscover("corazon-7");
    });

    /* ---- pop effect when something is tapped ---- */
    const pops: { sprite: THREE.Sprite; t: number; base: number }[] = [];
    const popAt = (sprite: THREE.Sprite) => pops.push({ sprite, t: 0, base: sprite.scale.y });

    /* ---- planets ---- */
    const planetGroups: { def: PlanetDef; group: THREE.Group; mesh: THREE.Mesh; mat: THREE.ShaderMaterial; icon: THREE.Sprite }[] =
      [];
    const planetGeo = track(new THREE.SphereGeometry(1, 40, 40));
    PLANETS.forEach((def, i) => {
      const group = new THREE.Group();
      const mat = track(
        new THREE.ShaderMaterial({
          uniforms: {
            uA: { value: new THREE.Color(def.a) },
            uB: { value: new THREE.Color(def.b) },
            uRim: { value: new THREE.Color(def.rim) },
            uTime: uniforms.uTime,
            uSeed: { value: i * 1.7 },
          },
          vertexShader: planetVertex,
          fragmentShader: planetFragment,
        }),
      );
      const mesh = new THREE.Mesh(planetGeo, mat);
      mesh.scale.setScalar(def.radius);
      group.add(mesh);

      const halo = new THREE.Sprite(
        track(
          new THREE.SpriteMaterial({ map: glow, color: def.rim, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }),
        ),
      );
      halo.scale.setScalar(def.radius * 4.2);
      group.add(halo);

      if (def.ring) {
        const ringMesh = new THREE.Mesh(
          track(new THREE.RingGeometry(def.radius * 1.35, def.radius * 2.1, 64)),
          track(new THREE.MeshBasicMaterial({ color: def.ring, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })),
        );
        ringMesh.rotation.x = 1.25;
        ringMesh.rotation.y = 0.3;
        group.add(ringMesh);
      }

      const iconTex = track(pixelTexture(def.sprite));
      const icon = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: iconTex, transparent: true, depthWrite: false })));
      const ia = iconTex.image.width / iconTex.image.height;
      icon.scale.set(1.3 * ia, 1.3, 1);
      icon.position.y = def.radius + 1.05;
      group.add(icon);

      group.userData = { angle: def.angle };
      scene.add(group);
      planetGroups.push({ def, group, mesh, mat, icon });

      const go = () => {
        popAt(icon);
        flyTo(group, () => propsRef.current.onPlace(def.id));
      };
      addTarget(mesh, go);
      addTarget(icon, go);
    });

    /* ---- secrets ---- */
    const secretSprites: { sprite: THREE.Sprite; base: THREE.Vector3; speed: number; spin: number; orbit?: number }[] = [];
    const addSecret = (
      name: SpriteName,
      height: number,
      pos: THREE.Vector3,
      id: string,
      opts: { orbit?: number; spin?: number } = {},
    ) => {
      const tex = track(pixelTexture(name));
      const s = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })));
      const a = tex.image.width / tex.image.height;
      s.scale.set(height * a, height, 1);
      s.position.copy(pos);
      scene.add(s);
      secretSprites.push({ sprite: s, base: pos.clone(), speed: 0.6 + Math.random(), spin: opts.spin ?? 0, orbit: opts.orbit });
      addTarget(s, () => {
        popAt(s);
        propsRef.current.onDiscover(id);
      });
      return s;
    };
    addSecret("cat", 1.4, new THREE.Vector3(-12.5, 4.5, -6), "mia-espacio");
    addSecret("pinky", 1.1, new THREE.Vector3(4.2, 1.2, 0), "pinky-espacio", { orbit: 4.4 });
    addSecret("seven", 0.9, new THREE.Vector3(1.5, -8.5, 9), "siete");
    addSecret("moon", 3.2, new THREE.Vector3(-18, 16, -26), "luna-universo");

    // Urano: a small blue planet with a ring, far away
    {
      const group = new THREE.Group();
      const mat = track(
        new THREE.ShaderMaterial({
          uniforms: {
            uA: { value: new THREE.Color("#c9fbff") },
            uB: { value: new THREE.Color("#2f9fc4") },
            uRim: { value: new THREE.Color("#e3f8ff") },
            uTime: uniforms.uTime,
            uSeed: { value: 9 },
          },
          vertexShader: planetVertex,
          fragmentShader: planetFragment,
        }),
      );
      const mesh = new THREE.Mesh(planetGeo, mat);
      mesh.scale.setScalar(0.85);
      group.add(mesh);
      const uRing = new THREE.Mesh(
        track(new THREE.RingGeometry(1.1, 1.55, 48)),
        track(new THREE.MeshBasicMaterial({ color: "#d2b4ff", transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false })),
      );
      uRing.rotation.set(0.3, 1.45, 0);
      group.add(uRing);
      group.position.set(15, 7, 10);
      scene.add(group);
      addTarget(mesh, () => {
        heartKick = 0.5;
        propsRef.current.onDiscover("urano");
      });
      planetGroups.push({
        def: { ...PLANETS[0], id: "carta", orbit: 0, height: 7, angle: 0, radius: 0.85 },
        group,
        mesh,
        mat,
        icon: new THREE.Sprite(),
      });
      group.userData = { fixed: true };
    }

    /* ---- phrases ---- */
    const phraseSprites: { sprite: THREE.Sprite; index: number; found: boolean; base: THREE.Vector3 }[] = [];
    const makePhraseMaterial = (text: string, found: boolean) => {
      const { texture, aspect } = textTexture(text, {
        color: found ? "#ffe9a8" : "#fff4fa",
        glow: found ? "#ffb347" : "#ff6fa8",
        size: 46,
        maxWidth: 560,
      });
      track(texture);
      return { mat: track(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.95 })), aspect };
    };

    /* ---- photos ---- */
    const photoSprites: THREE.Sprite[] = [];

    let fontsReady = false;
    const buildText = () => {
      if (fontsReady) return;
      fontsReady = true;
      const r = rng(1234);
      const found = new Set(propsRef.current.discovered);
      frases.forEach((text, i) => {
        const arm = i % 3;
        const rad = 8.5 + (i / frases.length) * 8 + r() * 1.5;
        const a = (arm / 3) * Math.PI * 2 + rad * 0.38 + 0.25;
        const base = new THREE.Vector3(Math.cos(a) * rad, (r() - 0.5) * 3.2, Math.sin(a) * rad);
        base.applyEuler(galaxy.rotation);
        const isFound = found.has(`frase-${i + 1}`);
        const { mat, aspect } = makePhraseMaterial(text, isFound);
        const s = new THREE.Sprite(mat);
        const hh = (mobile ? 1.3 : 0.95) * ((mat.map!.image as HTMLCanvasElement).height / 110);
        s.scale.set(hh * aspect, hh, 1);
        s.position.copy(base);
        scene.add(s);
        phraseSprites.push({ sprite: s, index: i, found: isFound, base });
        addTarget(s, () => {
          popAt(s);
          propsRef.current.onDiscover(`frase-${i + 1}`);
        });
      });

      PLANETS.forEach((def, i) => {
        const { texture, aspect } = textTexture(planetas[def.id], { size: 40, plate: true, glow: "#000000" });
        track(texture);
        const label = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })));
        const lh = mobile ? 1.1 : 0.8;
        label.scale.set(lh * aspect, lh, 1);
        label.position.y = -(def.radius + 0.85);
        planetGroups[i].group.add(label);
      });

      // photos: polaroids that float around the heart
      const loader = new THREE.TextureLoader();
      fotosUniverso.forEach((foto, i) => {
        loader.load(foto.src, (tex) => {
          track(tex);
          tex.colorSpace = THREE.SRGBColorSpace;
          const img = tex.image as HTMLImageElement;
          const c = document.createElement("canvas");
          const W = 360;
          const H = 420;
          c.width = W;
          c.height = H;
          const g = c.getContext("2d")!;
          g.fillStyle = "#fffaf2";
          g.fillRect(0, 0, W, H);
          const s = Math.max(320 / img.width, 300 / img.height);
          g.save();
          g.beginPath();
          g.rect(20, 20, 320, 300);
          g.clip();
          g.drawImage(img, 20 + (320 - img.width * s) / 2, 20 + (300 - img.height * s) / 2, img.width * s, img.height * s);
          g.restore();
          g.fillStyle = "#6b4a3a";
          g.font = `28px ${pixelFontFamily()}`;
          g.textAlign = "center";
          g.fillText(foto.texto.slice(0, 22), W / 2, 372);
          const ct = track(new THREE.CanvasTexture(c));
          ct.colorSpace = THREE.SRGBColorSpace;
          const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: ct, transparent: true, depthWrite: false })));
          sp.scale.set(1.5, 1.75, 1);
          const a = (i / Math.max(1, fotosUniverso.length)) * Math.PI * 2;
          sp.position.set(Math.cos(a) * 4.6, Math.sin(a * 2) * 1.5 + 1, Math.sin(a) * 4.6);
          sp.userData = { a };
          scene.add(sp);
          photoSprites.push(sp);
          addTarget(sp, () => {
            popAt(sp);
            propsRef.current.onPhoto(i);
          });
        });
      });
    };
    void document.fonts.ready.then(buildText);
    const fontFallback = window.setTimeout(buildText, 2500);

    /* ---- shooting stars ---- */
    const shooting: { line: THREE.Line; t: number; dir: THREE.Vector3; start: THREE.Vector3 }[] = [];
    const shootMat = track(new THREE.LineBasicMaterial({ color: "#fff6fb", transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
    let nextShoot = 2;

    /* ---- camera framing ---- */
    const frame = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      const aspect = w / Math.max(1, h);
      camera.aspect = aspect;
      camera.fov = aspect < 1 ? 62 : 52;
      camera.updateProjectionMatrix();
      return aspect;
    };
    const aspect = frame();
    const dist = aspect < 1 ? Math.min(34, 21 / Math.pow(aspect, 0.55)) : 30;
    camera.position.set(0, dist * 0.42 + HOME_Y, dist * 0.9);
    controls.target.set(0, HOME_Y, 0);
    controls.update();

    const ro = new ResizeObserver(() => frame());
    ro.observe(mount);

    /* ---- flying to a planet ---- */
    let flight: {
      from: THREE.Vector3;
      to: THREE.Vector3;
      fromTarget: THREE.Vector3;
      toTarget: () => THREE.Vector3;
      t: number;
      dur: number;
      done: () => void;
    } | null = null;
    let returnPos: THREE.Vector3 | null = null;

    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function flyTo(group: THREE.Group, done: () => void) {
      if (flight) return;
      returnPos = camera.position.clone();
      const target = group.getWorldPosition(new THREE.Vector3());
      const dir = camera.position.clone().sub(target).normalize();
      controls.enabled = false;
      controls.autoRotate = false;
      flight = {
        from: camera.position.clone(),
        to: target.clone().add(dir.multiplyScalar(4.2)),
        fromTarget: controls.target.clone(),
        toTarget: () => group.getWorldPosition(new THREE.Vector3()),
        t: 0,
        dur: 1.05,
        done,
      };
    }

    function flyBack() {
      if (!returnPos) return;
      controls.enabled = false;
      flight = {
        from: camera.position.clone(),
        to: returnPos.clone(),
        fromTarget: controls.target.clone(),
        toTarget: () => new THREE.Vector3(0, HOME_Y, 0),
        t: 0,
        dur: 0.9,
        done: () => {
          controls.enabled = true;
          controls.autoRotate = true;
        },
      };
      returnPos = null;
    }

    /* ---- input: taps vs drags ---- */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down: { x: number; y: number; t: number } | null = null;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onUp = (e: PointerEvent) => {
      if (!down || flight) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const quick = performance.now() - down.t < 450;
      down = null;
      if (moved > 10 || !quick) return;
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(
        targets.map((t) => t.object),
        false,
      );
      if (!hits.length) return;
      const hit = hits[0];
      targets.find((t) => t.object === hit.object)?.onTap(hit);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    /* ---- full turn detection (only while she drags) ---- */
    let dragging = false;
    let lastAz = controls.getAzimuthalAngle();
    let turned = 0;
    let resumeTimer: number | undefined;
    const onStart = () => {
      dragging = true;
      controls.autoRotate = false;
      window.clearTimeout(resumeTimer);
      lastAz = controls.getAzimuthalAngle();
    };
    const onEnd = () => {
      dragging = false;
      resumeTimer = window.setTimeout(() => {
        if (!flight && !returnPos) controls.autoRotate = true;
      }, 5000);
    };
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);

    /* ---- loop ---- */
    let lastFrame = performance.now();
    const delta = () => {
      const now = performance.now();
      const d = Math.max(0, (now - lastFrame) / 1000);
      lastFrame = now;
      return d;
    };
    let raf = 0;
    let paused = propsRef.current.paused;
    let running = false;

    const tick = () => {
      const dt = Math.min(delta(), 0.05);
      const t = (uniforms.uTime.value += dt);

      galaxy.rotation.y += dt * 0.03;
      ring.rotation.z += dt * 0.25;

      // heartbeat
      const beat = Math.pow(Math.max(0, Math.sin(t * 2.6)), 12) * 0.08 + Math.pow(Math.max(0, Math.sin(t * 2.6 - 0.5)), 12) * 0.05;
      heartKick = Math.max(0, heartKick - dt * 2.5);
      const hs = 1 + beat + heartKick * 0.25;
      heart.scale.setScalar(hs);
      heart.quaternion.copy(camera.quaternion);
      heartGlow.scale.setScalar(7 * (1 + beat * 1.5 + heartKick * 0.4));

      for (const p of planetGroups) {
        if (p.group.userData.fixed) {
          p.group.rotation.y += dt * 0.2;
          continue;
        }
        p.group.userData.angle += dt * 0.05;
        const a = p.group.userData.angle;
        p.group.position.set(Math.cos(a) * p.def.orbit, p.def.height + Math.sin(t * 0.8 + a * 3) * 0.25, Math.sin(a) * p.def.orbit);
        p.mesh.rotation.y += dt * 0.3;
        p.icon.position.y = p.def.radius + 1.05 + Math.sin(t * 2 + a) * 0.08;
      }

      for (const s of secretSprites) {
        if (s.orbit) {
          const a = t * 0.35;
          s.sprite.position.set(Math.cos(a) * s.orbit, s.base.y + Math.sin(t * 1.3) * 0.4, Math.sin(a) * s.orbit);
        } else {
          s.sprite.position.y = s.base.y + Math.sin(t * s.speed) * 0.35;
        }
      }

      for (const p of phraseSprites) {
        p.sprite.position.y = p.base.y + Math.sin(t * 0.7 + p.index) * 0.18;
      }

      for (const sp of photoSprites) {
        const a = (sp.userData.a += dt * 0.12);
        sp.position.set(Math.cos(a) * 4.6, Math.sin(a * 2) * 1.2 + 1.2, Math.sin(a) * 4.6);
      }

      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        p.t += dt;
        const k = Math.min(1, p.t / 0.45);
        const s = 1 + Math.sin(k * Math.PI) * 0.35;
        const ratio = p.sprite.scale.x / p.sprite.scale.y;
        p.sprite.scale.set(p.base * s * ratio, p.base * s, 1);
        if (k >= 1) {
          p.sprite.scale.set(p.base * ratio, p.base, 1);
          pops.splice(i, 1);
        }
      }

      // shooting stars
      nextShoot -= dt;
      if (nextShoot <= 0) {
        nextShoot = 3 + Math.random() * 5;
        const start = new THREE.Vector3((Math.random() - 0.5) * 60, 10 + Math.random() * 14, -20 - Math.random() * 20);
        const dir = new THREE.Vector3(-0.8 - Math.random() * 0.4, -0.35, 0.2).normalize();
        const geo = track(new THREE.BufferGeometry().setFromPoints([start, start.clone().add(dir.clone().multiplyScalar(4))]));
        const line = new THREE.Line(geo, shootMat.clone());
        track(line.material as THREE.Material);
        scene.add(line);
        shooting.push({ line, t: 0, dir, start });
      }
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        s.t += dt;
        const m = s.line.material as THREE.LineBasicMaterial;
        m.opacity = Math.sin(Math.min(1, s.t / 1.1) * Math.PI) * 0.9;
        s.line.position.copy(s.dir.clone().multiplyScalar(s.t * 26));
        if (s.t > 1.1) {
          scene.remove(s.line);
          s.line.geometry.dispose();
          shooting.splice(i, 1);
        }
      }

      if (flight) {
        flight.t += dt / flight.dur;
        const k = ease(Math.min(1, flight.t));
        camera.position.lerpVectors(flight.from, flight.to, k);
        controls.target.lerpVectors(flight.fromTarget, flight.toTarget(), k);
        camera.lookAt(controls.target);
        if (flight.t >= 1) {
          const done = flight.done;
          flight = null;
          done();
        }
      } else {
        controls.update();
      }

      if (dragging) {
        const az = controls.getAzimuthalAngle();
        let d = az - lastAz;
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        turned += d;
        lastAz = az;
        if (Math.abs(turned) >= Math.PI * 2) {
          turned = 0;
          propsRef.current.onDiscover("vuelta");
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      delta();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => (document.hidden || paused ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    if (!paused) start();
    else renderer.render(scene, camera);

    apiRef.current = {
      setPaused(p) {
        if (p === paused) return;
        paused = p;
        if (p) {
          // Keep animating until the flight into the planet finishes.
          window.setTimeout(() => paused && stop(), 60);
        } else {
          start();
          flyBack();
        }
      },
      markFound(ids) {
        if (!fontsReady) return;
        const found = new Set(ids);
        for (const p of phraseSprites) {
          if (!p.found && found.has(`frase-${p.index + 1}`)) {
            p.found = true;
            const { mat } = makePhraseMaterial(frases[p.index], true);
            p.sprite.material = mat;
          }
        }
      },
    };

    return () => {
      stop();
      window.clearTimeout(fontFallback);
      window.clearTimeout(resumeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      ro.disconnect();
      controls.dispose();
      for (const d of disposables) d.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      apiRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
