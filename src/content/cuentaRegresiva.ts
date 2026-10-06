import { config } from "./config";

/**
 * ⏳  LA CUENTA REGRESIVA
 * ─────────────────────────────────────────────────────────────
 * Lo que pasa mientras ella espera: Mía se va despertando, el candado late
 * cada vez más fuerte y los últimos 10 segundos son un show.
 * Cambia solo lo que está entre comillas (y los números si quieres).
 */
export const cuentaRegresiva = {
  /** Mía según cuánto falta. Los minutos son "cuando falten menos de…". */
  mia: {
    /** Más de 2 horas: dormida. */
    dormida: [
      "Zzz… (Mía está soñando contigo)",
      "Shhh, Mía duerme. Te despierta cuando falte poquito.",
      "Mía ronca bajito… prrr",
    ],
    /** Menos de 2 horas: se despereza. */
    despertandoMinutos: 120,
    despertando: [
      "*bostezo* ¿Ya casi?",
      "Mía se está desperezando…",
      "Mía abrió un ojito. Sabe que falta poco.",
    ],
    /** Menos de 20 minutos: sentada mirando el sobre. */
    despiertaMinutos: 20,
    despierta: [
      "Mía no le quita los ojos al sobre 👀",
      "Mía está lista. ¿Y tú?",
      "Mía cuida el sobre hasta que se abra",
    ],
    /** El último minuto: emocionada. */
    emocionada: ["¡¡Miau!! ¡Ya casi!", "Mía está brincando de la emoción", "¡Prepárate! 💜"],
  },

  /** Lo que dice debajo del número grande en los últimos 10 segundos. */
  ultimos: {
    texto: "Ya casi, mi amor…",
    alFinal: `¡Feliz ${config.meses} meses, mi amor!`,
  },

  /** El pedacito de Chachacha que suena al llegar a 0 (en segundos). */
  pedacito: {
    desde: 95,
    dura: 20,
  },
};
