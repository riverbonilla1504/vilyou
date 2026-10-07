/**
 * 🎟  CUPONES DE AMOR
 * ─────────────────────────────────────────────────────────────
 * 7 cupones en un cofre. Ella los voltea para leerlos (cada uno leído le
 * da una canción) y cuando quiera usar uno, te lo muestra y lo marca como
 * canjeado.
 */
export const cupones: { titulo: string; texto: string }[] = [
  { titulo: "Abrazo de 7 minutos", texto: "Vale por un abrazo de 7 minutos completos, sin soltarte ni un segundo." },
  { titulo: "Cita sorpresa", texto: "Vale por una cita sorpresa: yo planeo todo, tú solo te pones bonita (más)." },
  { titulo: "Helado de Oreo", texto: "Vale por un helado de Oreo, el que tú quieras, cuando tú quieras." },
  { titulo: "Tú eliges la peli", texto: "Vale por una noche de peli que eliges tú, sin quejas (bueno, casi)." },
  { titulo: "Día de mimos", texto: "Vale por un día entero de mimos, besitos y apapachos." },
  { titulo: "Cena hecha por mí", texto: "Vale por una cena hecha por mí, con todo mi amor (y ojalá sin quemar nada)." },
  { titulo: "Un deseo", texto: "Vale por un deseo, el que tú quieras. Yo lo cumplo." },
];

export const textosCupones = {
  titulo: "Cofre de cupones",
  ayuda: "Toca un cupón para voltearlo y leerlo",
  canjear: "Canjear",
  canjeado: "Canjeado ♥",
  comoCanjear: "Muéstrame este cupón cuando lo quieras usar 💜",
};
