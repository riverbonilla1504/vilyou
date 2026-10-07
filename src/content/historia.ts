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
  /** La foto es vertical (se muestra 3:4 en vez de 4:3). */
  fotoVertical?: boolean;
  /** Qué parte de la foto se ve si se recorta, por ejemplo "50% 0%" (arriba). */
  fotoAjuste?: string;
  /** Más fotos, en chiquito debajo de la principal. */
  fotosExtra?: string[];
  /** Un dibujo pixel en vez de foto. */
  ilustracion?: "halloween";
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
    ilustracion: "halloween",
    tema: "halloween",
    etiqueta: "El comienzo",
    titulo: "Cuando te conocí",
    subtitulo: "Halloween — empezó la magia",
    parrafos: [
      "Aquí empezó todo sin darnos cuenta. Gracias a este día, en el que ni siquiera nos dirigimos miradas, pero sin saberlo, estábamos destinados a estar juntos 💜",
    ],
    secretos: [1],
  },
  {
    id: "s2",
    foto: "/fotos/carnavales.jpg",
    fotoVertical: true,
    fotoAjuste: "50% 60%",
    tema: "carnival",
    titulo: "Carnavales",
    subtitulo: "Risas, colores y tú",
    parrafos: [
      "Conociéndonos un poco mejor, disfrutando de nuestros días juntos y emocionados por vernos otra vez después de un mes eterno sin estar uno junto al otro. Luego, todo fue felicidad por estar juntos.",
    ],
    fotoConSecreto: 3,
    secretos: [2, 6],
  },
  {
    id: "s3",
    foto: "/fotos/mirador-flores.jpg",
    fotoVertical: true,
    fotoAjuste: "50% 0%",
    tema: "park",
    titulo: "El mirador",
    subtitulo: "Un parque y montañas para soñarnos",
    parrafos: [
      "Donde te prometí mi amor eterno y que fueras tú la mujer que me va a acompañar durante mi vida. Recuerdo que estaba muy nervioso porque todo saliera muy bien y de la mejor manera, porque desde el principio siempre quise lo mejor de lo mejor, para la mejor mujer del universoooooooo.",
    ],
    secretos: [4, 5],
  },
  {
    id: "s4",
    foto: "/fotos/historia-4.jpg",
    fotosExtra: ["/fotos/historia-3.jpg", "/fotos/historia-1.jpg"],
    tema: "sunset",
    titulo: "Atardecer",
    subtitulo: "Cielo naranja y promesas suaves",
    parrafos: [
      "Cada atardecer contigo se siente como ese sueño feliz muy largo del que no me quiero despertar. Me encanta ver cómo el cielo se pinta de naranja mientras estás a mi lado, porque ahí me doy cuenta de que lo más bonito del día siempre eres tú.",
      "Tú eres la luz que ilumina mi camino, mi cielo, y con cada día que pasa este amor crece más y más. Quiero muchísimos atardeceres más contigo, de esos tranquilitos, bajito… y hacia adelante.",
    ],
    sieteEstrellas: true,
  },
  {
    id: "s5",
    foto: "/fotos/historia-5.jpg",
    fotosExtra: ["/fotos/historia-2.jpg"],
    tema: "love",
    titulo: "Amor",
    subtitulo: "Mi todo, mi hogar",
    parrafos: [
      "Contigo lo quiero todo, mi vida, desde la más mínima cosa hasta las cosas más grandes. Eres mi hogar, mi calma y mi felicidad, y yo sé que si estamos juntos nada nos queda grande.",
      "Quiero que sigamos creciendo juntos, porque eres mi futuro entero. Te amo hoy, mañana y siempre, mi cielo 💜",
    ],
    secretos: [7],
  },
];

export const secretos: Record<EggId, Secreto> = {
  1: {
    titulo: "Urano orbitando",
    texto: "Nuestro planetita, girando solo para ti.",
    pista: "Algo gira allá arriba…",
    sprite: "uranus",
    animacion: "orbita",
  },
  2: {
    titulo: "Helado de Oreo",
    texto: "Un heladito de Oreo, para compartir contigo.",
    pista: "Un antojito dulce",
    sprite: "iceCream",
    animacion: "baila",
  },
  3: {
    titulo: "Gatito escondido",
    texto: "¡Lo encontraste! Estaba escondido detrás de la foto.",
    pista: "Algo se esconde detrás de la foto",
    sprite: "cat",
    animacion: "flota",
  },
  4: {
    titulo: "Atardecer y luna",
    texto: "Los atardeceres son más bonitos contigo.",
    pista: "Donde el cielo se pinta",
    sprite: "sunsetMoon",
    animacion: "flota",
  },
  5: {
    titulo: "Rayitos de sol",
    texto: "Tú me dices tu rayito de sol… y tú eres mis ricitos de oro.",
    pista: "Calientito y brillante",
    sprite: "sun",
    animacion: "brilla",
  },
  6: {
    titulo: "Pinky, nuestra hijita",
    texto: "Pinky, nuestra hijita gordita, te manda un abrazo.",
    pista: "Una pitahaya con magia",
    sprite: "pinky",
    animacion: "baila",
  },
  7: {
    titulo: "Tulipanes y lirios",
    texto: "Tulipanes, lirios y nuestro 7: todo lo bonito es tuyo.",
    pista: "El número 7 florece",
    sprite: "tulip",
    animacion: "late",
  },
};

/** Lo que aparece cuando encuentra los 7 secretos. */
export const final = {
  titulo: "¡Los 7 secretos!",
  texto:
    "Encontraste los 7 secretos. Eres la mejor buscadora del universo ♥",
};

/** El cierre de la página. */
export const pie = {
  titulo: "Continuará…",
  texto: "Porque esto apenas empieza.",
  firma: "Hecho con amor, para la mujer más especial del universo",
};
