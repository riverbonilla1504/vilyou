/**
 * 🎶  LAS LETRAS QUE SALEN DEL DISCO
 * ─────────────────────────────────────────────────────────────
 * Mientras suena una canción, en el segundo que pongas sale flotando una
 * frase desde el disco (o desde el botón del tocadiscos si no hay disco en
 * pantalla). Duran unos 4 segundos.
 *
 *  - La clave es el `id` de la canción (está en musica.ts).
 *  - `segundo`: en qué momento de la canción sale (1:35 = 95).
 *  - `texto`: lo que sale. Puede ser un pedacito de la letra o algo tuyo.
 *
 * Por ahora hay frases tuyas de ejemplo; cámbialas por la parte de la
 * canción que más te recuerde a ella.
 */
export const letras: Record<string, { segundo: number; texto: string }[]> = {
  chachacha: [
    { segundo: 12, texto: "Esta va para ti 💜" },
    { segundo: 60, texto: "¿Bailamos?" },
    { segundo: 95, texto: "Esta parte me recuerda a ti" },
    { segundo: 160, texto: "Te amo" },
  ],
  "reina-pepiada": [
    { segundo: 10, texto: "Nuestra canción ♥" },
    { segundo: 70, texto: "Mi reina" },
    { segundo: 150, texto: "Contigo, siempre" },
  ],
};
