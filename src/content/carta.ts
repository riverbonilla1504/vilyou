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
  para: "Para: Valeria",

  /** Arriba a la derecha (una fecha, un lugar, lo que quieras). */
  fecha: "7 de octubre · 8 meses",

  saludo: "Mi amor:",

  parrafos: [
    "Este es el primer párrafo de la carta. Aquí va lo primero que quieres que lea cuando la abra.",
    "Aquí puedes contarle lo que sentiste la primera vez que la viste, o ese detalle suyo que te encanta y que nadie más nota.",
    "Y aquí, todo lo que sueñas para lo que viene. Puedes agregar tantos párrafos como quieras.",
  ],

  despedida: "Con todo mi corazón,",

  firma: "River",

  /** Déjalo vacío ("") si no quieres posdata. */
  posdata: "P.D. Cuando termines, entra a nuestro universo: hay 77 cositas escondidas para ti.",

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
