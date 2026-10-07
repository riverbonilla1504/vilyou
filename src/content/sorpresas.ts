/**
 * ✨  SORPRESAS DEL UNIVERSO
 * ─────────────────────────────────────────────────────────────
 * El modo noche, Pinky escondida, el abrazo de 7 segundos, la carta en la
 * botella y su nombre en las estrellas. Cambia los textos que quieras.
 */

/** Entre las 11 p. m. y las 2 a. m. el universo se pone en modo noche. */
export const modoNoche = {
  desde: 23,
  hasta: 2,
  dice: "¿Tampoco puedes dormir? Yo también estoy pensando en ti 🌙",
};

/**
 * Pinky se esconde cada día en un lugar distinto. Cuando la encuentra,
 * dice una de estas frases (una distinta cada día).
 */
export const pinkyEscondida = {
  frases: [
    "¡Me encontraste, mamá! Papá dice que te extraña muchísimo.",
    "Shhh… estaba jugando a las escondidas. ¡Eres muy buena!",
    "Psst… si mantienes el dedo sobre el corazón del universo 7 segundos, pasa algo bonito.",
    "Papá dice que eres la más linda del universo (y yo estoy de acuerdo).",
    "¡Encontrada! Te mereces un apapacho gordito.",
    "Hoy me escondí aquí porque sabía que vendrías ♥",
    "Psst… la luna del universo guarda un secreto si la tocas muchas veces.",
  ],
};

/** El abrazo: mantener el dedo sobre el corazón del universo 7 segundos. */
export const abrazo = {
  mientras: "Abrazándote…",
  listo: "Abrazo enviado 💜",
  dice: "Ese abrazo me llegó hasta acá. Te lo devuelvo cuando te vea, pero más largo.",
};

/** La carta en la botella que flota por el universo. */
export const botella = {
  titulo: "Una carta en una botella",
  parrafos: [
    "Si encontraste esta botellita flotando en nuestro universo, es porque la dejé aquí para ti.",
    "Ojalá pudiera meter en ella todos los abrazos que te debo, todas las veces que pienso en ti en el día y todas las ganas que tengo de verte cuando no estás.",
    "Eres la casualidad más bonita de mi vida, esa que llegó sin avisar y lo cambió todo. Gracias por elegirme cada día, por quererme bonito y por hacerme sentir en casa.",
    "Pase lo que pase, aquí te voy a esperar siempre: en este universo y en todos los demás.",
  ],
  firma: "Tu Esposo",
};

/** Su nombre formado con estrellas (tocando la luna del universo 7 veces). */
export const nombreEstrellas = {
  nombre: "VALERIA",
  dice: "Hasta las estrellas se saben tu nombre.",
};
