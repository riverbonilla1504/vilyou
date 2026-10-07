import type { SpriteName } from "@/components/pixel/sprites";

/**
 * ✉  TU CARTA
 * ─────────────────────────────────────────────────────────────
 * Aquí escribes todo lo que dice la carta del inicio.
 *
 *  - Cambia solo el texto que está entre comillas.
 *  - Cada línea de `parrafos` es un párrafo nuevo: agrega o quita los que quieras.
 *  - Si quieres usar comillas dentro del texto, usa “ ” en vez de " ".
 */
export const carta = {
  /** Arriba a la izquierda del papel. */
  para: "Para: El amor de mi vida",

  /** Arriba a la derecha (una fecha, un lugar, lo que quieras). */
  fecha: "7 de octubre · 8 meses",

  saludo: "Mi corazón:",

  parrafos: [
    "Hoy cumplimos 8 meses, los 8 meses más felices de mi vida. Te quiero dar esta carta con todo el sentimiento que tengo en mí, pero hasta tú misma sabes que es imposible, porque lo que siento en estos momentos, siempre que pienso en ti, es tanto que nunca de los nuncas cabría en una carta. Pero créeme que con cada palabra linda lo intento todos los días, así yo sepa que es un objetivo imposible; día a día quiero hacerte sentir todo eso que me haces sentir a mí, todo el amor, todo el agradecimiento que siento por ti, mi cielo. Yo sé que a veces soy muy cuadriculado en muchos aspectos, pero siempre intento ser mejor para ti. Esta es una de las muchas formas de expresarme que te he demostrado; esta carta va con todo el cariño del mundo para el amor de mi vida.",
    "Tú eres una luz que ilumina mi camino, mi cielo. Eres lo más importante que tengo y quiero que siempre sepas que eres la mejor novia del mundo, la mujer de mis sueños, y a veces hasta me toca pellizcarme para estar seguro de que no sigo soñando, porque estar contigo se siente como eso: un sueño feliz muy largo en el que disfruto cada día que estás a mi lado. Te amo demasiado, mi vida, y con cada día este amor por ti crece más y más. Este amor nunca se va a acabar, y contigo lo quiero todo porque eres mi todo.",
    "Quiero todo contigo, mi cielo, desde la más mínima cosa hasta las cosas más grandes. Quiero tener una vida junto a ti, con todas las cosas felices, con todos los problemas que enfrentemos, con toda la felicidad que sentimos y absolutamente todo contigo, porque yo sé que si estamos juntos nada nos queda grande, y lo hemos demostrado juntos. Tú, mi cielo, dueña de mi corazón, de mi amor y de mi felicidad: quiero todo contigo, quiero unos hijos muy lindos juntos, quiero que seas más que mi novia, te quiero para toda mi vida. Te quiero, te adoro, eres mi obsesión siempre y para siempre, eres la mamá de nuestros futuros hijos, eres mi futura esposa y eres mi futuro entero. Quiero que sigamos creciendo juntos, porque para mí eso eres: mi vida, mi futuro infinito, porque yo sé que pase lo que pase vamos a estar conectados por siempre, mi cielo. Te amooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.",
  ],

  despedida: "Con todo mi corazón,",

  firma: "Tu Esposo",

  /** Déjalo vacío ("") si no quieres posdata. */
  posdata:
    "P.D. Espero que disfrutes mucho este regalito y que encuentres todas las cositas que hice para ti con mucho amor. Como ya te he dicho, tiene muchísimos detallitos para que los encuentres, y al final habrá una sorpresa para ti que yo sé que no es mucho, pero espero que te guste.",

  /** El regalito que viene adjunto a la carta, como en Stardew Valley. */
  regalo: {
    nombre: "Mi corazón",
    cantidad: 1,
    sprite: "heart",
  },
} satisfies {
  para: string;
  fecha: string;
  saludo: string;
  parrafos: string[];
  despedida: string;
  firma: string;
  posdata: string;
  regalo: { nombre: string; cantidad: number; sprite: SpriteName };
};
