import type { SpriteName } from "@/components/pixel/sprites";
import { config } from "./config";
import { secretos, type EggId } from "./historia";
import { frases } from "./universo";

/**
 * ✦  LAS 77 COSITAS
 * ─────────────────────────────────────────────────────────────
 * Todo lo que ella puede descubrir. El álbum y el contador salen de aquí.
 * Puedes cambiar `titulo`, `texto` y `pista` de cada una.
 * No cambies los `id`: el código los usa para saber dónde está cada cosa.
 */

export type Categoria =
  | "carta"
  | "lugares"
  | "universo"
  | "frases"
  | "historia"
  | "jardin"
  | "pastel"
  | "juegos"
  | "peluches"
  | "cielo"
  | "especiales";

export type Descubrimiento = {
  id: string;
  categoria: Categoria;
  titulo: string;
  texto: string;
  /** Se ve en el álbum mientras no lo ha encontrado. */
  pista: string;
  sprite: SpriteName;
};

export const categorias: Record<Categoria, { nombre: string; sprite: SpriteName }> = {
  carta: { nombre: "La carta", sprite: "envelope" },
  lugares: { nombre: "Lugares", sprite: "uranus" },
  universo: { nombre: "Secretos del universo", sprite: "sparkle" },
  frases: { nombre: "Frases", sprite: "heartSmall" },
  historia: { nombre: "Nuestra historia", sprite: "book" },
  jardin: { nombre: "El jardín", sprite: "tulip" },
  pastel: { nombre: "El pastel", sprite: "cake" },
  juegos: { nombre: "Juegos", sprite: "gamepad" },
  peluches: { nombre: "Peluches", sprite: "pinky" },
  cielo: { nombre: "El cielo", sprite: "moon" },
  especiales: { nombre: "Especiales", sprite: "seven" },
};

const d = (
  id: string,
  categoria: Categoria,
  sprite: SpriteName,
  titulo: string,
  texto: string,
  pista: string,
): Descubrimiento => ({ id, categoria, sprite, titulo, texto, pista });

export const descubrimientos: Descubrimiento[] = [
  // ── La carta ──
  d("hola", "carta", "heart", "Llegaste", "Bienvenida a tu regalo, mi vida. Todo esto lo hice pensando en ti.", "Entra a la página."),
  d("candado", "carta", "shackle", "El candadito", "Sabías la clave. Obvio: nadie me conoce como tú.", "Abre el candado de la carta."),
  d("carta", "carta", "envelope", "La carta", "La leíste toda. Cada palabra es tuya.", "Lee la carta hasta el final."),
  d("regalo", "carta", "heart", "Mi corazón", "Ya es tuyo. Cuídamelo bonito.", "Recibe el regalo de la carta."),
  d("sello", "carta", "heartSmall", "El sello", "Ese selito de cera lo puse con mucho amor (y mucha paciencia).", "Toca el sello de la carta."),

  // ── Lugares (los 7 planetas) ──
  d("lugar-carta", "lugares", "envelope", "Planeta carta", "La carta siempre va a estar aquí, por si quieres volver a leerla.", "Visita el planeta de la carta."),
  d("lugar-jardin", "lugares", "tulip", "El jardín", "Un árbol de tulipanes y lirios, como nosotros: creciendo.", "Visita el planeta del jardín."),
  d("lugar-historia", "lugares", "book", "Nuestra historia", "Todo lo que hemos vivido, capítulo por capítulo.", "Visita el planeta de la historia."),
  d("lugar-pastel", "lugares", "cake", "El pastel", `${config.meses} meses merecen pastel. Y velitas. Y tú.`, "Visita el planeta del pastel."),
  d("lugar-juegos", "lugares", "gamepad", "La sala de juegos", "Obvio no podía faltar, mi vida.", "Visita el planeta de los juegos."),
  d("lugar-peluches", "lugares", "pinky", "El rincón de los peluches", "Pinky, Melody, Cody y Mía te estaban esperando.", "Visita el planeta de los peluches."),
  d("lugar-cancion", "lugares", "note", "Nuestra canción", "Siempre que la escucho pienso en ti.", "Visita el planeta de la música."),

  // ── Secretos del universo ──
  d("corazon-7", "universo", "heart", "Siete latidos", "Tocaste el corazón 7 veces. Así late el mío cuando te veo.", "Toca el corazón del universo varias veces…"),
  d("urano", "universo", "uranus", "Urano", "Nuestro planetita. Contigo hasta Urano y más allá.", "Busca un planeta azul con anillo."),
  d("luna-universo", "universo", "moon", "La luna", "Mi lunita. Hasta en el espacio te busco.", "En el universo también hay luna."),
  d("mia-espacio", "universo", "cat", "Mía astronauta", "Mía se subió al universo… menos mal no se cayó.", "Alguien peludito anda flotando por ahí."),
  d("pinky-espacio", "universo", "pinky", "Pinky en órbita", "Pinky gordita flotando entre estrellas. Nuestra hijita explora.", "Una pitahaya morada flota en el espacio."),
  d("siete", "universo", "seven", "El 7", "Nuestro número, escondido entre las estrellas.", "Busca nuestro número en el cielo."),
  d("vuelta", "universo", "sparkle", "La vuelta al universo", "Le diste la vuelta completa. Te daría la vuelta al mundo también.", "Gira el universo completito."),

  // ── Frases (salen de universo.ts) ──
  ...frases.map((f, i) =>
    d(`frase-${i + 1}`, "frases", "heartSmall", f, f, "Toca las frases que flotan en el universo."),
  ),

  // ── Nuestra historia (los 7 secretos del timeline) ──
  ...([1, 2, 3, 4, 5, 6, 7] as EggId[]).map((n) =>
    d(`secreto-${n}`, "historia", secretos[n].sprite, secretos[n].titulo, secretos[n].texto, secretos[n].pista),
  ),
  d("historia-fin", "historia", "book", "Continuará…", "Llegaste al final de la historia… por ahora.", "Llega al final de nuestra historia."),

  // ── El jardín ──
  d("arbol", "jardin", "tulip", "El árbol", "Lo viste florecer. Así creció lo nuestro: de una semillita.", "Mira crecer el árbol del jardín."),
  d("petalo", "jardin", "lily", "Un pétalo", "Atrapaste un pétalo al vuelo. Pide un deseo.", "Atrapa un pétalo que cae."),
  d("lirio", "jardin", "lily", "Un lirio", "Los lirios son tuyos; los tulipanes también. Todo el jardín, la verdad: de aquí saco las flores, mi vida.", "Toca una flor del árbol."),
  d("contador", "jardin", "sparkle", "Nuestro tiempo", "Cada segundo desde el 7 de noviembre cuenta. Y los que faltan, más.", "Toca el contador del jardín."),

  // ── El pastel ──
  d("deseo", "pastel", "sparkle", "Un deseo", "No me lo digas… ojalá sea conmigo.", "Pide un deseo antes de soplar."),
  d("velas", "pastel", "cake", `Las ${config.meses} velitas`, `Las soplaste todas. Feliz ${config.meses} meses, mi amor.`, "Sopla las velas del pastel."),
  d("mordisco", "pastel", "cake", "Un mordisquito", "Si te sobra me das, mi vida. Guárdame un pedacito.", "Después de las velas, prueba el pastel."),

  // ── Juegos ──
  d("wordle", "juegos", "gamepad", "Adivina mi corazón", config.wordle.ganaste, "Gana el juego de la palabra."),
  d("wordle-rapido", "juegos", "gamepad", "Telepatía", "La adivinaste en 3 intentos o menos. Me lees la mente.", "Adivina la palabra en 3 intentos o menos."),
  d("memoria", "juegos", "heart", "Memoria de elefante", "Encontraste todas las parejas. Como nosotros.", "Completa el juego de memoria."),

  // ── Peluches ──
  d("pinky", "peluches", "pinky", "Apapacho a Pinky", "Pinky es gordita y cute. Como debe ser.", "Apapacha a Pinky."),
  d("melody", "peluches", "melody", "Hola, Melody", "Melody te manda besitos.", "Saluda a Melody."),
  d("cody", "peluches", "cody", "¡Corre, Cody!", "Las cabritas corren cuando las asustas… pero Cody siempre vuelve.", "Asusta a Cody."),
  d("mia", "peluches", "cat", "Mimos a Mía", "Mía aceptó tus mimos. Es un honor.", "Consiente a Mía."),
  d("mia-ronroneo", "peluches", "catSleep", "Ronroneo", "La consentiste 7 veces y ronroneó. Te ama (pero no lo va a admitir).", "Consiente mucho a Mía…"),
  d("familia", "peluches", "heart", "La familia completa", "Saludaste a todos. Nuestra familia rara y bonita.", "Saluda a los cuatro."),

  // ── Canción ──
  d("cancion", "lugares", "note", "Dedicatoria", config.cancion.dedicatoria, "Lee la dedicatoria de nuestra canción."),

  // ── El cielo pixel (detrás de la carta y la historia) ──
  d("luna-pixel", "cielo", "moon", "Lunita", "Tocaste la luna. Ella también te mira bonito.", "Toca la luna del cielo pixelado."),
  d("estrella-fugaz", "cielo", "sparkle", "Estrella fugaz", "La atrapaste. Tu deseo ya está en camino.", "Atrapa una estrella fugaz (también cruzan el universo)."),
  d("nube", "cielo", "cloud", "Nubecita", "De esa nube llovieron corazones. Pasa cuando estás cerca.", "Toca una nube (también pasan por el jardín)."),
  d("calabaza", "cielo", "pumpkin", "Calabacita", "Halloween: donde empezó la magia.", "Toca una calabaza en la historia."),
  d("murcielago", "cielo", "bat", "Murciélago", "Lo asustaste. Tranquila, es inofensivo… como yo.", "Toca un murciélago en la historia."),
  d("tulipan-pixel", "cielo", "tulip", "Tulipanes", "Los tulipanes del suelo se pusieron felices al verte.", "Toca los tulipanes del suelo."),

  // ── Especiales ──
  d("hora-707", "especiales", "seven", "Un momento 7", "Viniste en un momento 7. Nuestro número te encontró.", "Ven cuando la hora o el minuto tengan un 7."),
  d("madrugada", "especiales", "moon", "Trasnochadora", "Entraste de madrugada. ¿No podías esperar? Yo tampoco.", "Ven de madrugada (después de las 12)."),
  d("dia-7", "especiales", "seven", "Un día 7", "Entraste un día 7. Todos los 7 son nuestros.", "Ven un día 7."),
  d("abrazo", "especiales", "heartSmall", "Un abrazo", "Abrazaste el corazón del universo. Ese abrazo me llegó hasta acá.", "Mantén el dedo sobre el corazón del universo 7 segundos."),
  d("album", "especiales", "book", "El álbum", "Aquí se guarda todo lo que vas descubriendo.", "Abre el álbum."),
  d("todo", "especiales", "heart", "¡Todo!", "Encontraste todas las cositas. Eres increíble. Te amo.", "Descúbrelo todo."),
];

export const TOTAL = descubrimientos.length;

export const porId = Object.fromEntries(descubrimientos.map((x) => [x.id, x])) as Record<string, Descubrimiento>;
