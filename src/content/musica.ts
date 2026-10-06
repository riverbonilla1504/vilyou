/**
 * 🎵  LA MÚSICA
 * ─────────────────────────────────────────────────────────────
 * Las canciones se coleccionan, como las cositas:
 *  - `dedicada` se desbloquea la primera vez que ella toca la luna (también
 *    durante la cuenta regresiva). La luna se vuelve un disco.
 *  - `nuestra` se desbloquea al tocar el disco del planeta "Nuestra canción".
 *  - Las de `escondidas` están en notitas musicales escondidas por la página.
 *  - Las demás de `playlist` salen solas: una por cada `cositasPorCancion`
 *    cositas que encuentra (en el orden de la lista).
 * Antes de que termine la cuenta regresiva solo se puede conseguir `dedicada`;
 * las demás se ven en el tocadiscos como adelanto.
 *
 * El disco del cielo toca, en aleatorio y en bucle, solo las que ya tiene.
 * Los archivos están en `public/musica/`. Puedes cambiar títulos y artistas
 * (no cambies los `id`).
 */

export type Cancion = { id: string; src: string; artista: string; titulo: string };

export const dedicada: Cancion = {
  id: "chachacha",
  src: "/musica/chachacha.m4a",
  artista: "Jósean Log",
  titulo: "Chachacha",
};

export const nuestra: Cancion = {
  id: "reina-pepiada",
  src: "/musica/reina-pepiada.m4a",
  artista: "Álvaro Díaz",
  titulo: "Reina Pepiada",
};

export const playlist: Cancion[] = [
  { id: "cuco-01", src: "/musica/playlist/01-9wiEM0s4aCQ.m4a", artista: "Cuco", titulo: "Lover Is a Day" },
  { id: "cuco-02", src: "/musica/playlist/02-ZyowJ5GB2Dk.m4a", artista: "Cuco", titulo: "Amor de Siempre" },
  { id: "cuco-03", src: "/musica/playlist/03-xIsCh-BA8Ew.m4a", artista: "Cuco", titulo: "Melting" },
  { id: "cuco-04", src: "/musica/playlist/04-ilUCwLLdltQ.m4a", artista: "Cuco", titulo: "Summertime Hightime (feat. J-Kwe$t)" },
  { id: "cuco-05", src: "/musica/playlist/05-VXQ3lzLq1S0.m4a", artista: "Cuco", titulo: "Bossa No Sé ft. Jean Carter" },
  { id: "cuco-06", src: "/musica/playlist/06-Oi9IhqY_Iv0.m4a", artista: "Cuco", titulo: "Lo que siento" },
  { id: "cuco-07", src: "/musica/playlist/07-X_MQV0863D4.m4a", artista: "Cuco", titulo: "Do Better" },
  { id: "cuco-08", src: "/musica/playlist/08-_1VyGyWpQpU.m4a", artista: "Cuco x CLAIRO", titulo: "DROWN" },
  { id: "cuco-09", src: "/musica/playlist/09-7pxV7qyjOlE.m4a", artista: "Cuco", titulo: "Hydrocodone" },
  { id: "cuco-10", src: "/musica/playlist/10-1fXYDkpfHsk.m4a", artista: "Cuco", titulo: "Dontmakemefallinlove" },
  { id: "cuco-11", src: "/musica/playlist/11-aWb3usKuDmo.m4a", artista: "Cuco", titulo: "Lava Lamp" },
  { id: "cuco-12", src: "/musica/playlist/12-kj-DaTXUKeo.m4a", artista: "MC Magic", titulo: "Search (ft. Cuco & Lil Rob)" },
  { id: "cuco-13", src: "/musica/playlist/13-WXDGGJHjEPI.m4a", artista: "Cuco", titulo: "We Had To End It" },
  { id: "cuco-14", src: "/musica/playlist/14-jBt_I4aMwMk.m4a", artista: "Cuco", titulo: "Piel Canela" },
  { id: "cuco-15", src: "/musica/playlist/15-XV8tI8-dVJQ.m4a", artista: "Cuco", titulo: "Sunnyside" },
  { id: "cuco-16", src: "/musica/playlist/16-oD8qP_h_ogs.m4a", artista: "Girl Ultra ft. Cuco", titulo: "DameLove" },
  { id: "cuco-17", src: "/musica/playlist/17-TkIIBkwtNJc.m4a", artista: "Cuco", titulo: "CR-V" },
  { id: "cuco-18", src: "/musica/playlist/18-8xV-bHJqDZE.m4a", artista: "Cuco", titulo: "Feelings" },
  { id: "cuco-19", src: "/musica/playlist/19-LYJn7GRTcWk.m4a", artista: "Cuco", titulo: "Mi Infinita" },
  { id: "cuco-20", src: "/musica/playlist/20-S8NzUCJujQ4.m4a", artista: "Lilbootycall", titulo: "777 ft. Cuco x KWE$T" },
  { id: "cuco-21", src: "/musica/playlist/21-2nV-ryyyZWs.m4a", artista: "Cuco & Dillon Francis", titulo: "Fix Me" },
  { id: "cuco-22", src: "/musica/playlist/22-MPiUrtOpfEA.m4a", artista: "Cuco", titulo: "Winter’s Ballad" },
  { id: "cuco-23", src: "/musica/playlist/23-2qrX7n5O9m0.m4a", artista: "Cuco", titulo: "Best Friend" },
  { id: "cuco-24", src: "/musica/playlist/24-Eyl6kJOegyo.m4a", artista: "Cuco", titulo: "Stay For a Bit" },
  { id: "cuco-25", src: "/musica/playlist/25-TK1QTclq9_c.m4a", artista: "Cuco", titulo: "Lovetripper" },
  { id: "cuco-26", src: "/musica/playlist/26-fGAu0IUMncU.m4a", artista: "Cuco", titulo: "One and Only" },
  { id: "cuco-27", src: "/musica/playlist/27-P2dNLRHbxrM.m4a", artista: "Cuco", titulo: "Lonelylife" },
  { id: "cuco-28", src: "/musica/playlist/28-2my0foWlpqA.m4a", artista: "Cuco", titulo: "Far Away From Home" },
  { id: "cuco-29", src: "/musica/playlist/29-UsOgSViTrQ8.m4a", artista: "Cuco", titulo: "Lucy feat. J-kwe$t" },
  { id: "cuco-30", src: "/musica/playlist/30-y6noQn8InZ8.m4a", artista: "Cuco", titulo: "Rest Easy, I’ll See You Again" },
  { id: "cuco-31", src: "/musica/playlist/31-WWpeyWdXuk4.m4a", artista: "Cuco", titulo: "1Night" },
  { id: "cuco-32", src: "/musica/playlist/32-U89200eHmOQ.m4a", artista: "Cuco", titulo: "When We Meet" },
  { id: "cuco-33", src: "/musica/playlist/33-4Rgb7-Kw5WY.m4a", artista: "Cuco", titulo: "Perihelion (Interlude)" },
  { id: "cuco-34", src: "/musica/playlist/34-oFokN2gE9FM.m4a", artista: "Cuco", titulo: "Lost / Heart" },
  { id: "cuco-35", src: "/musica/playlist/35-oMomZf2zCBY.m4a", artista: "Cuco", titulo: "Face in space" },
  { id: "cuco-36", src: "/musica/playlist/36-fou9XVzCpek.m4a", artista: "Cuco", titulo: "Keeping Tabs" },
  { id: "cuco-37", src: "/musica/playlist/37-2QTz9JzMebM.m4a", artista: "Cuco", titulo: "Brokey The Pear (Interlude)" },
];

/** Dónde está escondida cada notita y qué canción desbloquea. */
export const escondidas = {
  cielo: "cuco-02",
  jardin: "cuco-01",
  pastel: "cuco-15",
  peluches: "cuco-23",
  juegos: "cuco-25",
  historia: "cuco-19",
  album: "cuco-20",
} as const;

export type Escondite = keyof typeof escondidas;

/** Pista que se ve en el tocadiscos para cada escondite. */
export const pistasEscondites: Record<Escondite, string> = {
  cielo: "Una notita brilla entre las estrellas del inicio",
  jardin: "Escondida en el jardín",
  pastel: "Escondida cerca del pastel",
  peluches: "Uno de los peluches la tiene",
  juegos: "Escondida en la sala de juegos",
  historia: "Al final de nuestra historia",
  album: "Escondida en el álbum",
};

export const cositasPorCancion = 2;

export const textosMusica = {
  tocadiscos: "Tocadiscos",
  adelanto: "Adelanto: estas canciones se desbloquean cuando termine la cuenta regresiva ♥",
  pistaLuna: "Toca la luna",
  pistaNuestra: "Toca el disco del planeta “Nuestra canción”",
  pistaCositas: (n: number) => `Encuentra ${n} cositas`,
  nuevaCancion: "¡Canción nueva!",
  notaEncontrada: "¡Encontraste una canción escondida!",
  deslizar: "Toca el disco para pausar · deslízalo para cambiar de canción",
};
