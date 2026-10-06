import { config } from "./config";

/**
 * 💬  LO QUE DICE TU PERSONAJE
 * ─────────────────────────────────────────────────────────────
 * Los diálogos estilo Stardew que salen con tu pixel art en el inicio.
 * Cambia solo el texto entre comillas.
 */
export const dialogos = {
  /** El nombre que sale en la plaquita debajo de tu retrato. */
  nombre: config.yo,

  /** Cuando ella toca un tulipán del suelo. */
  tulipan:
    "Desde la primera vez que me dijiste que tus flores favoritas eran los tulipanes, nunca los pude sacar de mi mente.",

  /** Cuando toca un lirio. */
  lirio: "Lirios para mi delirio.",

  /** Sale un momentico después de que empieza a sonar la canción de la luna. */
  dedicatoria:
    "Te la dedico. Te amooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",

  /** Cuántos segundos esperar, después de que empieza la canción, para decir la dedicatoria. */
  esperaDedicatoria: 4,
};
