/**
 * 🎵  LA MÚSICA
 * ─────────────────────────────────────────────────────────────
 * La primera vez que ella toca la luna suena `dedicada`, la luna se vuelve un
 * disco y desde ahí (y cada vez que vuelva a entrar) suena `playlist` en
 * bucle y en orden aleatorio. Los archivos están en `public/musica/`.
 * Puedes cambiar los títulos; si agregas canciones, pon el archivo en
 * `public/musica/playlist/` y una línea nueva aquí.
 */

export type Cancion = { src: string; titulo: string };

export const dedicada: Cancion = {
  src: "/musica/chachacha.m4a",
  titulo: "Jósean Log - Chachacha",
};

export const playlist: Cancion[] = [
  { src: "/musica/playlist/01-9wiEM0s4aCQ.m4a", titulo: "Cuco - Lover Is a Day" },
  { src: "/musica/playlist/02-ZyowJ5GB2Dk.m4a", titulo: "Cuco - Amor de Siempre" },
  { src: "/musica/playlist/03-xIsCh-BA8Ew.m4a", titulo: "Cuco - Melting" },
  { src: "/musica/playlist/04-ilUCwLLdltQ.m4a", titulo: "Cuco - Summertime Hightime (feat. J-Kwe$t)" },
  { src: "/musica/playlist/05-VXQ3lzLq1S0.m4a", titulo: "Cuco - Bossa No Sé ft. Jean Carter" },
  { src: "/musica/playlist/06-Oi9IhqY_Iv0.m4a", titulo: "Cuco - Lo que siento" },
  { src: "/musica/playlist/07-X_MQV0863D4.m4a", titulo: "Cuco - Do Better" },
  { src: "/musica/playlist/08-_1VyGyWpQpU.m4a", titulo: "Cuco x CLAIRO - DROWN" },
  { src: "/musica/playlist/09-7pxV7qyjOlE.m4a", titulo: "Cuco - Hydrocodone" },
  { src: "/musica/playlist/10-1fXYDkpfHsk.m4a", titulo: "Cuco - Dontmakemefallinlove" },
  { src: "/musica/playlist/11-aWb3usKuDmo.m4a", titulo: "Cuco - Lava Lamp" },
  { src: "/musica/playlist/12-kj-DaTXUKeo.m4a", titulo: "MC Magic - Search (ft. Cuco & Lil Rob)" },
  { src: "/musica/playlist/13-WXDGGJHjEPI.m4a", titulo: "Cuco - We Had To End It" },
  { src: "/musica/playlist/14-jBt_I4aMwMk.m4a", titulo: "Cuco - Piel Canela" },
  { src: "/musica/playlist/15-XV8tI8-dVJQ.m4a", titulo: "Cuco - Sunnyside" },
  { src: "/musica/playlist/16-oD8qP_h_ogs.m4a", titulo: "DameLove - Girl Ultra ft. Cuco" },
  { src: "/musica/playlist/17-TkIIBkwtNJc.m4a", titulo: "Cuco - CR-V" },
  { src: "/musica/playlist/18-8xV-bHJqDZE.m4a", titulo: "Cuco - Feelings" },
  { src: "/musica/playlist/19-LYJn7GRTcWk.m4a", titulo: "Cuco - Mi Infinita" },
  { src: "/musica/playlist/20-S8NzUCJujQ4.m4a", titulo: "Lilbootycall - 777 ft. Cuco x KWE$T" },
  { src: "/musica/playlist/21-2nV-ryyyZWs.m4a", titulo: "Cuco & Dillon Francis - Fix Me" },
  { src: "/musica/playlist/22-MPiUrtOpfEA.m4a", titulo: "Cuco - Winter’s Ballad" },
  { src: "/musica/playlist/23-2qrX7n5O9m0.m4a", titulo: "Cuco - Best Friend" },
  { src: "/musica/playlist/24-Eyl6kJOegyo.m4a", titulo: "Cuco - Stay For a Bit" },
  { src: "/musica/playlist/25-TK1QTclq9_c.m4a", titulo: "Cuco - Lovetripper" },
  { src: "/musica/playlist/26-fGAu0IUMncU.m4a", titulo: "Cuco - One and Only" },
  { src: "/musica/playlist/27-P2dNLRHbxrM.m4a", titulo: "Cuco - Lonelylife" },
  { src: "/musica/playlist/28-2my0foWlpqA.m4a", titulo: "Cuco - Far Away From Home" },
  { src: "/musica/playlist/29-UsOgSViTrQ8.m4a", titulo: "Cuco - Lucy feat. J-kwe$t" },
  { src: "/musica/playlist/30-y6noQn8InZ8.m4a", titulo: "Cuco - Rest Easy, I’ll See You Again" },
  { src: "/musica/playlist/31-WWpeyWdXuk4.m4a", titulo: "Cuco - 1Night" },
  { src: "/musica/playlist/32-U89200eHmOQ.m4a", titulo: "Cuco - When We Meet" },
  { src: "/musica/playlist/33-4Rgb7-Kw5WY.m4a", titulo: "Cuco - Perihelion (Interlude)" },
  { src: "/musica/playlist/34-oFokN2gE9FM.m4a", titulo: "Cuco - Lost / Heart" },
  { src: "/musica/playlist/35-oMomZf2zCBY.m4a", titulo: "Cuco - Face in space" },
  { src: "/musica/playlist/36-fou9XVzCpek.m4a", titulo: "Cuco - Keeping Tabs" },
  { src: "/musica/playlist/37-2QTz9JzMebM.m4a", titulo: "Cuco - Brokey The Pear (Interlude)" },
];
