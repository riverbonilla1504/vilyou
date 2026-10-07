import { config } from "./config";

/**
 * 🪐  LOS LUGARES DEL UNIVERSO
 * ─────────────────────────────────────────────────────────────
 * Textos del jardín, el pastel, los peluches y el universo.
 */

export const universoTextos = {
  titulo: "Nuestro universo",
  subtitulo: `${config.inicialElla} ♥ ${config.inicialYo}`,
  ayuda: "Arrastra para girar · pellizca para acercar · toca los planetas, las frases y lo que brille",
  bienvenida: "Bienvenida a nuestro universo, mi amor. Aquí hay 77 cositas escondidas para ti.",
};

/** Los 7 planetas. Puedes cambiar los nombres que se ven en el universo. */
export const planetas = {
  carta: "La carta",
  jardin: "El jardín",
  historia: "Nuestra historia",
  pastel: `${config.meses} meses`,
  juegos: "Juegos",
  peluches: "Peluches",
  cancion: "Nuestra canción",
};

export const jardin = {
  titulo: "Nuestro jardín",
  /** Se escriben solitas al lado del árbol, una por una. */
  lineas: [
    "Tulipanes y lirios para el amor de mi vida:",
    "Si pudiera elegir un lugar seguro, sería a tu lado.",
    "Cada día que pasa, este árbol florece un poquito más.",
    "Como lo nuestro.",
    "— Con amor, tu hombre",
  ],
  contador: "Desde que nos conocimos han pasado…",
};

export const pastel = {
  titulo: `¡Feliz ${config.meses} meses!`,
  deseo: "Cierra los ojos, pide un deseo…",
  soplar: "…y sopla al micrófono (o toca cada velita)",
  final: `Feliz ${config.meses} meses, mi amor. Por muchos meses más contigo.`,
};

/** Lo que dice cada peluche cuando lo tocas (va rotando). */
export const peluches = {
  pinky: [
    "¡Hola mamá! Soy Pinky, gordita y abrazable.",
    "Papá dice que te extraña cuando no estás.",
    "¿Me das un apapacho? *squish*",
  ],
  melody: [
    "¡Hola, mamá! Melody te manda besitos.",
    "Dice papá que eres la más bonita de todo el universo.",
    "Yo cuido tus sueños cuando duermes.",
  ],
  cody: [
    "¡Beeeh! *sale corriendo*",
    "Cody se asustó… pero ya volvió.",
    "Las cabritas corren cuando las asustan.",
  ],
  mia: [
    "Miau. (Traducción: puedes seguir consintiéndome.)",
    "Mía te mira con aprobación.",
    "Mía exige más mimos.",
    "Prrrr…",
  ],
};
