import type { SpriteName } from "@/components/pixel/sprites";
import type { ThemeId } from "@/components/PixelScene";

/**
 * ♥  NUESTRA HISTORIA
 * ─────────────────────────────────────────────────────────────
 * Los textos del timeline, los 7 secretos y el final.
 * Cambia solo lo que está entre comillas.
 *
 * Fotos: pon tus imágenes en la carpeta `public/fotos/` y escribe la ruta,
 * por ejemplo  foto: "/fotos/halloween.jpg".
 */

export type EggId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Capitulo = {
  id: string;
  /** Fondo animado que se ve mientras lees este capítulo. */
  tema: ThemeId;
  /** Etiquetita junto al título (opcional; bórrala si no la quieres). */
  etiqueta?: string;
  titulo: string;
  subtitulo: string;
  parrafos: string[];
  foto?: string;
  /** Secretos que aparecen en este capítulo. */
  secretos?: EggId[];
  /** La foto se puede arrastrar y esconde un secreto debajo. */
  fotoConSecreto?: EggId;
  /** Muestra las siete estrellitas. */
  sieteEstrellas?: boolean;
};

export type Secreto = {
  titulo: string;
  /** Lo que se lee al encontrarlo. */
  texto: string;
  /** Pista corta que aparece antes de encontrarlo. */
  pista: string;
  sprite: SpriteName;
  /** Cómo se mueve el objeto. */
  animacion: "orbita" | "flota" | "baila" | "brilla" | "late";
};

export const intro = {
  titulo: "Nuestra historia",
  subtitulo: "Bajito… y hacia adelante",
  texto:
    "Cada capítulo guarda un pedacito de nosotros: lunita, atardeceres, rayitos de sol, Pinky y un jardín de tulipanes y lirios.",
};

export const capitulos: Capitulo[] = [
  {
    id: "s1",
    tema: "halloween",
    etiqueta: "El comienzo",
    titulo: "Cuando te conocí",
    subtitulo: "Halloween — empezó la magia",
    parrafos: [
      "Placeholder de historia: aquí vas a escribir lo que pasó, lo que sentiste y lo que te hizo pensar “sí, es ella”.",
      "Detalles románticos: lunita, atardecer, rayitos, y un “7” que nos sigue guiñando el ojo.",
    ],
    secretos: [1],
  },
  {
    id: "s2",
    tema: "carnival",
    titulo: "Carnavales",
    subtitulo: "Risas, colores y tú",
    parrafos: [
      "Placeholder de historia: aquí vas a escribir lo que pasó, lo que sentiste y lo que te hizo pensar “sí, es ella”.",
      "Detalles románticos: lunita, atardecer, rayitos, y un “7” que nos sigue guiñando el ojo.",
    ],
    fotoConSecreto: 3,
    secretos: [2, 6],
  },
  {
    id: "s3",
    tema: "park",
    titulo: "El mirador",
    subtitulo: "Un parque y montañas para soñarnos",
    parrafos: [
      "Placeholder de historia: aquí vas a escribir lo que pasó, lo que sentiste y lo que te hizo pensar “sí, es ella”.",
      "Detalles románticos: lunita, atardecer, rayitos, y un “7” que nos sigue guiñando el ojo.",
    ],
    secretos: [4, 5],
  },
  {
    id: "s4",
    tema: "sunset",
    titulo: "Atardecer",
    subtitulo: "Cielo naranja y promesas suaves",
    parrafos: [
      "Placeholder de historia: aquí vas a escribir lo que pasó, lo que sentiste y lo que te hizo pensar “sí, es ella”.",
      "Detalles románticos: lunita, atardecer, rayitos, y un “7” que nos sigue guiñando el ojo.",
    ],
    sieteEstrellas: true,
  },
  {
    id: "s5",
    tema: "love",
    titulo: "Amor",
    subtitulo: "Mi todo, mi hogar",
    parrafos: [
      "Placeholder de historia: aquí vas a escribir lo que pasó, lo que sentiste y lo que te hizo pensar “sí, es ella”.",
      "Detalles románticos: lunita, atardecer, rayitos, y un “7” que nos sigue guiñando el ojo.",
    ],
    secretos: [7],
  },
];

export const secretos: Record<EggId, Secreto> = {
  1: {
    titulo: "Urano orbitando",
    texto: "Placeholder EE1: aquí va un texto lindo sobre nosotros y el universo.",
    pista: "Algo gira allá arriba…",
    sprite: "uranus",
    animacion: "orbita",
  },
  2: {
    titulo: "Helado de Oreo",
    texto: "Placeholder EE2: Helado de Oreo (aquí luego pones tu texto).",
    pista: "Un antojito dulce",
    sprite: "iceCream",
    animacion: "baila",
  },
  3: {
    titulo: "Gatito escondido",
    texto: "Placeholder EE3: encontraste al gatito (aquí luego pones tu texto).",
    pista: "Algo se esconde detrás de la foto",
    sprite: "cat",
    animacion: "flota",
  },
  4: {
    titulo: "Atardecer y luna",
    texto: "Placeholder EE4: aquí va tu texto sobre atardeceres y la luna.",
    pista: "Donde el cielo se pinta",
    sprite: "sunsetMoon",
    animacion: "flota",
  },
  5: {
    titulo: "Rayitos de sol",
    texto: "Placeholder EE5: aquí va tu texto sobre tus rayitos de sol.",
    pista: "Calientito y brillante",
    sprite: "sun",
    animacion: "brilla",
  },
  6: {
    titulo: "Pinky, nuestra hijita",
    texto: "Placeholder EE6: aquí va tu texto sobre Pinky (pitahaya de peluche).",
    pista: "Una pitahaya con magia",
    sprite: "pinky",
    animacion: "baila",
  },
  7: {
    titulo: "Tulipanes y lirios",
    texto: "Placeholder EE7: aquí va tu texto sobre tulipanes, lirios y el número 7.",
    pista: "El número 7 florece",
    sprite: "tulip",
    animacion: "late",
  },
};

/** Lo que aparece cuando encuentra los 7 secretos. */
export const final = {
  titulo: "¡Los 7 secretos!",
  texto:
    "Placeholder final: encontraste todos los secretos. Aquí va un mensajito especial para cuando lo complete todo.",
};

/** El cierre de la página. */
export const pie = {
  titulo: "Continuará…",
  texto: "Porque esto apenas empieza.",
  firma: "Hecho con amor, solo para ti",
};
