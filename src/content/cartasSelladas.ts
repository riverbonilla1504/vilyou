/**
 * 💌  CARTAS SELLADAS
 * ─────────────────────────────────────────────────────────────
 * Cartas que ella ve cerradas con candado y una cuenta regresiva, y que se
 * abren solas en su fecha (a medianoche, con la hora de su celular).
 * Agrega todas las que quieras. Escríbelas antes de su fecha: hasta ese día
 * ella solo ve el sobre cerrado.
 */
export type CartaSellada = {
  /** Cuándo se abre: "AÑO-MES-DÍATHORA:MIN:SEG". */
  abre: string;
  /** Lo que se ve en el sobre (también antes de abrirse). */
  titulo: string;
  saludo: string;
  parrafos: string[];
  firma: string;
};

export const cartasSelladas: CartaSellada[] = [
  {
    abre: "2026-11-07T00:00:00",
    titulo: "Un año desde que nos conocimos",
    saludo: "Mi corazón:",
    parrafos: ["Escribe aquí la carta del 7 de noviembre (un año desde aquel Halloween y 9 meses juntos)."],
    firma: "Tu Esposo",
  },
  {
    abre: "2026-12-07T00:00:00",
    titulo: "10 meses",
    saludo: "Mi cielo:",
    parrafos: ["Escribe aquí la carta de los 10 meses."],
    firma: "Tu Esposo",
  },
  {
    abre: "2027-01-07T00:00:00",
    titulo: "11 meses",
    saludo: "Mi vida:",
    parrafos: ["Escribe aquí la carta de los 11 meses."],
    firma: "Tu Esposo",
  },
  {
    abre: "2027-02-07T00:00:00",
    titulo: "¡Un año juntos!",
    saludo: "Mi amor:",
    parrafos: ["Escribe aquí la carta de nuestro primer año."],
    firma: "Tu Esposo",
  },
];

/** Lo que dices cuando hay una carta nueva para abrir. */
export const avisoCartaNueva = "Psst… hoy se abrió una carta sellada para ti. Está en la mochila 💌";
