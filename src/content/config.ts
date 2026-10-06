/**
 * ⚙  CONFIGURACIÓN GENERAL
 * ─────────────────────────────────────────────────────────────
 * Nombres, fechas y claves. Cambia solo lo que está entre comillas.
 *
 * Fechas: "AÑO-MES-DÍATHORA:MIN:SEG". Se leen con la hora del celular de ella,
 * así que "2026-10-07T00:00:00" es la medianoche del 7 de octubre donde esté.
 */
export const config = {
  ella: "Valeria",
  inicialElla: "V",
  yo: "River",
  inicialYo: "R",
  /** Lo primero que ve, arriba de la cuenta regresiva. */
  dedicatoria: "Para el amor de mi vida 💜",
  numeroEspecial: 7,
  meses: 8,

  /** El día que se conocieron (para el contador del jardín). */
  nosConocimos: "2025-11-07T00:00:00",

  /** Cuándo se desbloquea la página. Antes de eso se ve la cuenta regresiva. */
  desbloqueo: "2026-10-07T00:00:00",

  /**
   * Para verla tú antes de tiempo, abre la página con  ?vista=river  al final del link.
   * Otros trucos para probar:
   *   ?bloqueo=1    muestra la cuenta regresiva terminando en 10 segundos
   *   ?reiniciar=1  borra todo el progreso guardado en ese celular
   */
  claveVistaPrevia: "river",

  /** El candadito de la carta. */
  candado: {
    codigo: "150704",
    pista: "Pista: una fecha que conoces muy bien (DD MM AA)",
  },

  /** El juego de adivinar la palabra (5 letras, sin tildes). */
  wordle: {
    palabra: "TEAMO",
    pista: "Lo que te digo todos los días",
    ganaste: "Lo adivinaste… y es verdad, con todo mi corazón.",
  },

  /**
   * Nuestra canción. Pega el link de Spotify de la canción
   * (Compartir → Copiar enlace), por ejemplo:
   * "https://open.spotify.com/track/xxxxxxxxxxxxxxxx"
   */
  cancion: {
    titulo: "Reina Pepiada",
    artista: "Alvaro Diaz",
    spotify: "https://open.spotify.com/track/3yJ8buQlPzQtHyCicOGDJ0",
    dedicatoria: "Cada vez que la escucho, pienso en ti. Ponla bajito y abrázame aunque sea de lejos.",
  },
};

/** Fecha en milisegundos, leída en la hora local del celular. */
export function localTime(iso: string) {
  return new Date(iso).getTime();
}
