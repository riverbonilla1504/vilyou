# VILyou ♥

Regalo de **8 meses** de River para **Valeria**: una página retro estilo *Stardew Valley* con una carta con candado,
un universo 3D lleno de secretos y **77 cositas** por descubrir.

- **Link para ella:** https://vilyou.vercel.app
- **Se desbloquea:** miércoles **7 de octubre de 2026, 12:00 a. m.** (hora del celular de ella)
- **Nos conocimos:** 7 de noviembre de 2025 · **Número especial:** 7
- **Hecho para:** iPhone 16 (Safari), aunque también se ve bien en computador

> ⚠️ Nunca le mandes un link con `?vista=river` (eso salta la cuenta regresiva). Mándale solo `https://vilyou.vercel.app`.

---

## Índice

1. [Qué falta por hacer](#qué-falta-por-hacer)
2. [Cómo es la experiencia, paso a paso](#cómo-es-la-experiencia-paso-a-paso)
3. [La música](#la-música)
4. [Todo lo que se puede tocar](#todo-lo-que-se-puede-tocar)
5. [Las 77 cositas](#las-77-cositas)
6. [Cómo editar los textos y las fotos](#cómo-editar-los-textos-y-las-fotos)
7. [Trucos para probar](#trucos-para-probar)
8. [Cómo publicar cambios](#cómo-publicar-cambios)
9. [El QR](#el-qr)
10. [Cómo funciona por dentro](#cómo-funciona-por-dentro)
11. [Qué se probó y qué no](#qué-se-probó-y-qué-no)

---

## Qué falta por hacer

Lo más importante está arriba. Todo se cambia en la carpeta `src/content/` (ver [cómo editar](#cómo-editar-los-textos-y-las-fotos)).

**Antes de medianoche (lo que ella va a leer):**

- [ ] **La carta** (`src/content/carta.ts`): los 3 párrafos todavía son de ejemplo ("Este es el primer párrafo de la carta…").
- [ ] **Los 5 capítulos de la historia** (`src/content/historia.ts`): todos dicen "Placeholder de historia…".
- [ ] **Los 7 secretos** (`src/content/historia.ts`, en `secretos`): dicen "Placeholder EE1…", "Placeholder EE2…", etc.
- [ ] **El mensaje final** (cuando encuentra los 7 secretos de la historia), también en `historia.ts`: "Placeholder final…".
- [ ] **Pista del candado** (`src/content/config.ts`): dice "una fecha que conoces muy bien (DD MM AA)". Cámbiala si 150704 significa otra cosa.
- [ ] **Probar en tu iPhone** con `https://vilyou.vercel.app/?vista=river`, sobre todo:
  - tocar un planeta del universo (la cámara vuela hacia él y se abre el lugar);
  - soplar las velas del pastel con el micrófono;
  - tocar la luna: que suene Chachacha, salga la dedicatoria y el disco pause/siga al tocarlo (en iPhone la música arranca con el primer toque; el navegador no deja que suene sola).
- [ ] Después de cada cambio, **publicar** (ver [cómo publicar](#cómo-publicar-cambios)).

**Opcional:**

- [ ] Revisar las frases del universo, lo que dicen los peluches y los textos de las 77 cositas: ya son lindos y personalizados, pero los escribió Claude y puedes ponerles tu voz.
- [ ] Cambiar qué foto va en cada capítulo de la historia (`src/content/historia.ts`, campo `foto`).
- [ ] Borrar los componentes viejos que ya no se usan: `src/components/DynamicBackground.tsx`, `EasterEggModal.tsx`, `Hud.tsx`, `PhotoPlaceholder.tsx` y la carpeta `src/components/eggs/`.
- [ ] Autorizar el MCP de Vercel en Claude (`/mcp` → **vercel** → **Authenticate**) si quieres que Claude maneje Vercel directamente.

**Ya está hecho:**

- [x] Publicada en Vercel y conectada a GitHub (cada push a `main` se publica sola).
- [x] Canción: **"Reina Pepiada" de Alvaro Diaz** sonando en su propio tocadiscos (archivo en `public/musica/`).
- [x] Mía dibujada como es: atigrada café con pecho, hocico y patitas blancas, ojos verdes.
- [x] Dedicatoria del inicio: "Para el amor de mi vida 💜".
- [x] QR bonito listo en `extras/qr-vilyou.png`.
- [x] **Fotos**: 5 en los capítulos de la historia y 19 flotando en el universo (sacadas de `extras/fotos/`, achicadas a `public/fotos/`).
- [x] **Ustedes dos en pixel art** (retratos estilo Stardew que parpadean; River mueve la boca al hablar).
- [x] **Diálogos de River** al tocar un tulipán o un lirio, con X para cerrar (`src/content/dialogos.ts`).
- [x] **La luna se vuelve disco**: suena *Chachacha* de Jósean Log, River se la dedica con corazones morados y desde ahí el disco toca **las canciones que ella ha conseguido**, en bucle y aleatorio, cada vez que entra.
- [x] **Canciones coleccionables (39)** y un **tocadiscos** para verlas, elegirlas y cambiarlas (ver [la música](#la-música)).

---

## Cómo es la experiencia, paso a paso

### 1. Cuenta regresiva (antes de medianoche)

- Cielo pixel de noche con luna, estrellas, nubes, luciérnagas y una fila de 7 flores abajo.
- Arriba: **"Para el amor de mi vida 💜"** y **"Algo bonito te espera…"**.
- **Mía durmiendo** (con "z z") y el **sobre con un candado de corazón dorado**.
- Contador de madera estilo Stardew: días, horas, minutos y segundos.
- Una burbuja abajo le dice que **todo se puede tocar** y cuenta cuántos corazones ha hecho en el cielo.
- Puede dejar la página abierta: a las 12:00 cambia sola a **"¡Ya es hora! ♥"** con el botón **"Abrir mi regalo ♥"**.

### 2. La carta

1. Aparece el sobre flotando con **"¡Tienes una carta nueva!"**, pero tiene **candado**.
2. Al tocarlo sale un **teclado retro**: hay que escribir **150704**. Si se equivoca, el teclado tiembla y dice "casi"; después de 2 intentos aparece la pista.
3. Al acertar, el candado se abre y cae, se rompe el sello de corazón, se abre la solapa y sale la carta.
4. La carta se escribe **letra por letra** con sonido retro (se puede saltar con "Mostrar todo ▸▸").
5. Al final: firma "River", un **sello de cera** que se puede tocar, la posdata y un **regalo adjunto** ("Mi corazón") para recibir.
6. Botón **"✦ Entrar a nuestro universo ✦"** → transición de **tulipanes y lirios** que llenan la pantalla.

La segunda vez que entra ya no ve la carta primero: va directo al universo (la carta queda en su planeta).

### 3. Nuestro universo (3D)

- Galaxia de partículas rosadas y moradas que gira, con un **corazón de partículas que late** en el centro y un anillo.
- Se gira **arrastrando** con el dedo y se acerca **pellizcando**.
- **7 planetas**, cada uno es un lugar. Al tocarlo, la cámara vuela hacia él y se abre:

| Planeta | Lugar | Qué hay |
|---|---|---|
| ✉ La carta | Releer la carta | La carta completa sobre el cielo pixel |
| 🌷 El jardín | Árbol de tulipanes y lirios | Una semilla cae, crece el árbol y florece un **corazón de flores**; caen pétalos; texto que se escribe solo y **contador desde que se conocieron** |
| 📖 Nuestra historia | El timeline original | 5 capítulos (Halloween, Carnavales, El mirador, Atardecer, Amor) con fondos que cambian y **7 secretos** |
| 🎂 8 meses | Pastel | Pide un deseo y **sopla las 8 velitas** (con el micrófono o tocándolas); luego puede **morder** el pastel |
| 🎮 Juegos | Wordle y memoria | **"Adivina mi corazón"** (palabra secreta **TEAMO**, 6 intentos) y un **juego de memoria** con Mía, Pinky, Melody, Cody, tulipán, lirio, el 7 y un corazón |
| 🍇 Peluches | El rincón de los peluches | **Pinky** se aplasta, **Melody** saluda, **Cody** sale corriendo y vuelve, **Mía** maúlla (a los 7 mimos ronronea) |
| 🎵 Nuestra canción | Música | Un tocadiscos con **"Reina Pepiada"** (al tocarlo suena y se desbloquea) y la dedicatoria |

- Abajo: el contador **"Descubrimientos 12/77"**, que abre el **álbum**.
- La primera vez aparece un mensaje de bienvenida.
- El botón de atrás del iPhone (deslizar) cierra el lugar abierto.

### 4. El álbum

Como las colecciones de Stardew: 77 espacios por categoría. Lo encontrado aparece a color; lo que falta, como silueta.
Al tocar algo encontrado se lee su texto; al tocar algo que falta se ve una **pista**.
Cada vez que descubre algo aparece arriba un aviso **"¡Nuevo descubrimiento! · 13/77"** con sonidito.

---

## La música

Las canciones se coleccionan como las cositas (todo se cambia en `src/content/musica.ts`):

| Canción | Cómo se consigue |
|---|---|
| *Chachacha* (Jósean Log) | Tocando la luna. Es la **única que se puede conseguir durante la cuenta regresiva** |
| *Reina Pepiada* (Álvaro Díaz) | Tocando el disco en el planeta "Nuestra canción" |
| 7 canciones de Cuco | Notitas escondidas: entre las estrellas del inicio, en el jardín, junto al pastel, con los peluches, en los juegos, al final de la historia y al final del álbum |
| Las otras 30 | Salen solas: **una por cada 2 cositas** que encuentra |

- Antes de que termine la cuenta regresiva, el tocadiscos muestra todas como **adelanto** ("se desbloquea pronto").
- Cada canción nueva avisa arriba con **"¡Canción nueva!"** y suena justo después de la que está sonando.
- El disco del cielo solo toca las que ya tiene, en aleatorio y sin repetir hasta que suenen todas.

---

## Todo lo que se puede tocar

| Dónde | Qué tocar | Qué pasa |
|---|---|---|
| Cuenta regresiva | Mía | Salta, maúlla y dice frases; a los 7 toques ronronea |
| Cuenta regresiva | El sobre | Se sacude: "¡Todavía no! Se abre a medianoche 🔒", etc. |
| Cuenta regresiva | El contador | Rebota y da pistas de qué más tocar |
| Cuenta regresiva y carta | **La luna** | La primera vez: se convierte en un **disco que gira**, suena *Chachacha* y a los 4 segundos River dice "Te la dedico. Te amoooo…" con **corazones morados**. Desde ahí: **tocar** el disco pausa / sigue (con fade suave, el disco frena / arranca) y **deslizarlo** de lado pasa a otra canción (con sonido de scratch) |
| Cuenta regresiva, carta y universo | **El tocadiscos** (botón con un vinilo arriba a la izquierda) | Lista de las 39 canciones: las conseguidas se pueden tocar; las que faltan salen como "???" con su pista. Controles ⏮ ⏯ ⏭ y barra para adelantar |
| Inicio, jardín, pastel, peluches, juegos, historia y álbum | **Notitas musicales escondidas** (7) | Cada una desbloquea una canción |
| Cuenta regresiva y carta | Las nubes | Llueven corazones |
| Cuenta regresiva y carta | La estrella fugaz (pasa cada ~10 s) | Llueven corazones |
| Cuenta regresiva y carta | **Las 7 flores del suelo** | Cada una salta, gira y suelta corazones. Los **tulipanes** abren a River diciendo lo de los tulipanes; los **lirios**, "Lirios para mi delirio" |
| Cuenta regresiva y carta | Cualquier parte | Salen corazoncitos y chispitas |
| Carta | Sobre / candado / sello / regalo | Ver [la carta](#2-la-carta) |
| Universo | Planetas | Abren su lugar |
| Universo | Frases flotantes (21) | Se vuelven doradas y cuentan como descubrimiento |
| Universo | Corazón del centro | Late más fuerte; a los 7 toques, secreto |
| Universo | Urano, la luna, Mía astronauta, Pinky en órbita, el 7 dorado | Secretos |
| Historia | Murciélago y calabaza (capítulo de Halloween) | Secretos |
| Historia | Foto de Carnavales | Se arrastra y aparece el gatito |
| Jardín | Pétalos que caen / flores del árbol / contador | Secretos; el contador cambia a días, horas, minutos y segundos totales |

---

## Las 77 cositas

Todo lo que ella puede descubrir. El contador del universo y el álbum salen de esta lista (`src/content/descubrimientos.ts`).
La última ("¡Todo!") se desbloquea sola al encontrar las otras 76.

**La carta** (5)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 1 | Llegaste | Entra a la página. |
| 2 | El candadito | Abre el candado de la carta. |
| 3 | La carta | Lee la carta hasta el final. |
| 4 | Mi corazón | Recibe el regalo de la carta. |
| 5 | El sello | Toca el sello de la carta. |

**Lugares** (8)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 6 | Planeta carta | Visita el planeta de la carta. |
| 7 | El jardín | Visita el planeta del jardín. |
| 8 | Nuestra historia | Visita el planeta de la historia. |
| 9 | El pastel | Visita el planeta del pastel. |
| 10 | La sala de juegos | Visita el planeta de los juegos. |
| 11 | El rincón de los peluches | Visita el planeta de los peluches. |
| 12 | Nuestra canción | Visita el planeta de la música. |

**Secretos del universo** (7)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 13 | Siete latidos | Toca el corazón del universo varias veces… |
| 14 | Urano | Busca un planeta azul con anillo. |
| 15 | La luna | En el universo también hay luna. |
| 16 | Mía astronauta | Alguien peludito anda flotando por ahí. |
| 17 | Pinky en órbita | Una pitahaya morada flota en el espacio. |
| 18 | El 7 | Busca nuestro número en el cielo. |
| 19 | La vuelta al universo | Gira el universo completito. |

**Frases** (21)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 20 | Eres mi lugar favorito | Toca las frases que flotan en el universo. |
| 21 | Contigo todo es más bonito | Toca las frases que flotan en el universo. |
| 22 | Mi 7 de la suerte | Toca las frases que flotan en el universo. |
| 23 | Te elegiría en todos los universos | Toca las frases que flotan en el universo. |
| 24 | Mi persona favorita | Toca las frases que flotan en el universo. |
| 25 | V ♥ R | Toca las frases que flotan en el universo. |
| 26 | 8 meses y contando | Toca las frases que flotan en el universo. |
| 27 | Gracias por existir | Toca las frases que flotan en el universo. |
| 28 | Eres mi calma | Toca las frases que flotan en el universo. |
| 29 | Mi corazón es tuyo | Toca las frases que flotan en el universo. |
| 30 | Te quiero más que Mía a sus siestas | Toca las frases que flotan en el universo. |
| 31 | Mi rayito de sol | Toca las frases que flotan en el universo. |
| 32 | Mi lunita | Toca las frases que flotan en el universo. |
| 33 | Desde el 7 de noviembre | Toca las frases que flotan en el universo. |
| 34 | Hasta Urano y más allá | Toca las frases que flotan en el universo. |
| 35 | Eres preciosa | Toca las frases que flotan en el universo. |
| 36 | Tú y yo, siempre | Toca las frases que flotan en el universo. |
| 37 | Bajito… y hacia adelante | Toca las frases que flotan en el universo. |
| 38 | Mi hogar eres tú | Toca las frases que flotan en el universo. |
| 39 | Pinky te manda un abrazo | Toca las frases que flotan en el universo. |
| 40 | Te amo, Valeria | Toca las frases que flotan en el universo. |

**Nuestra historia** (8)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 41 | Urano orbitando | Algo gira allá arriba… |
| 42 | Helado de Oreo | Un antojito dulce |
| 43 | Gatito escondido | Algo se esconde detrás de la foto |
| 44 | Atardecer y luna | Donde el cielo se pinta |
| 45 | Rayitos de sol | Calientito y brillante |
| 46 | Pinky, nuestra hijita | Una pitahaya con magia |
| 47 | Tulipanes y lirios | El número 7 florece |
| 48 | Continuará… | Llega al final de nuestra historia. |

**El jardín** (4)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 49 | El árbol | Mira crecer el árbol del jardín. |
| 50 | Un pétalo | Atrapa un pétalo que cae. |
| 51 | Un lirio | Toca una flor del árbol. |
| 52 | Nuestro tiempo | Toca el contador del jardín. |

**El pastel** (3)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 53 | Un deseo | Pide un deseo antes de soplar. |
| 54 | Las 8 velitas | Sopla las velas del pastel. |
| 55 | Un mordisquito | Después de las velas, prueba el pastel. |

**Juegos** (3)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 56 | Adivina mi corazón | Gana el juego de la palabra. |
| 57 | Telepatía | Adivina la palabra en 3 intentos o menos. |
| 58 | Memoria de elefante | Completa el juego de memoria. |

**Peluches** (6)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 59 | Apapacho a Pinky | Apapacha a Pinky. |
| 60 | Hola, Melody | Saluda a Melody. |
| 61 | ¡Corre, Cody! | Asusta a Cody. |
| 62 | Mimos a Mía | Consiente a Mía. |
| 63 | Ronroneo | Consiente mucho a Mía… |
| 64 | La familia completa | Saluda a los cuatro. |

**Lugares** (8)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 65 | Dedicatoria | Lee la dedicatoria de nuestra canción. |

**El cielo** (6)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 66 | Lunita | Toca la luna del cielo pixelado. |
| 67 | Estrella fugaz | Atrapa una estrella fugaz. |
| 68 | Nubecita | Toca una nube. |
| 69 | Calabacita | Toca una calabaza en la historia. |
| 70 | Murciélago | Toca un murciélago en la historia. |
| 71 | Tulipanes | Toca los tulipanes del suelo. |

**Especiales** (6)

| # | Cosita | Cómo se encuentra |
|---|---|---|
| 72 | 7:07 | Entra a una hora muy nuestra… |
| 73 | Trasnochadora | Entra de madrugada. |
| 74 | Un día 7 | Entra un día 7. |
| 75 | Volviste | Vuelve otro día. |
| 76 | El álbum | Abre el álbum. |
| 77 | ¡Todo! | Descúbrelo todo. |

---

## Cómo editar los textos y las fotos

Todo lo que ella lee está en `src/content/`. Cambia **solo lo que está entre comillas**.

| Archivo | Qué cambia |
|---|---|
| `config.ts` | Nombres, iniciales, **dedicatoria del inicio**, fecha de desbloqueo, fecha en que se conocieron, **código y pista del candado**, palabra del Wordle, la **dedicatoria de nuestra canción** |
| `carta.ts` | **La carta**: para, fecha, saludo, párrafos (agrega los que quieras), despedida, firma, posdata y el regalo adjunto |
| `historia.ts` | Los 5 **capítulos** (título, subtítulo, párrafos, foto), los **7 secretos** y el **mensaje final** |
| `universo.ts` | Las **21 frases** del universo y las **fotos** que flotan alrededor del corazón |
| `lugares.ts` | Nombres de los planetas, textos del jardín y del pastel, y lo que dice cada peluche |
| `descubrimientos.ts` | Título, texto y pista de cada una de las **77 cositas** (no cambies los `id`) |
| `dialogos.ts` | Lo que dice **tu personaje** al tocar un tulipán, un lirio y la **dedicatoria** de la canción (y cuántos segundos espera) |
| `musica.ts` | Las **39 canciones** (títulos y artistas), dónde está escondida cada notita, sus pistas, cada cuántas cositas sale una canción y los textos del tocadiscos |

**Consejos:**

- Si escribes comillas dentro de un texto, usa “ ” en vez de " ".
- Cada párrafo de la carta va entre comillas y termina en coma.
- **Fotos:** guárdalas en `public/fotos/` (por ejemplo `public/fotos/halloween.jpg`) y en el capítulo escribe `foto: "/fotos/halloween.jpg",`.
  Para el universo: `{ src: "/fotos/nosotros.jpg", texto: "Nuestra primera foto" },` dentro de `fotosUniverso`.
- **Fecha de desbloqueo:** `desbloqueo: "2026-10-07T00:00:00"` se lee con la hora del celular de ella.

---

## Trucos para probar

Agrega esto al final del link (en tu celular, no en el de ella):

| Truco | Qué hace |
|---|---|
| `?vista=river` | Salta la cuenta regresiva y deja ver todo (se queda guardado en ese celular) |
| `?vista=ella` | Quita el modo de prueba y vuelve a mostrar la cuenta regresiva |
| `?bloqueo=1` | Muestra la cuenta regresiva terminando en 10 segundos (para ver el momento de "¡Ya es hora!") |
| `?reiniciar=1` | Borra todo lo descubierto y el progreso en ese celular |

El progreso (lo descubierto, si abrió el candado, si leyó la carta) se guarda **en cada celular** por separado.

**En tu computador:**

```bash
npm install
npm run dev
```

y abre http://localhost:3000/?vista=river

---

## Cómo publicar cambios

Vercel está **conectado al repositorio de GitHub**: cada vez que se sube un commit a `main`, la página se publica sola en el mismo link (tarda 1–2 minutos).

```bash
git add .
git commit -m "Escribo mi carta"
git push
```

También se puede publicar directo desde el computador, sin GitHub:

```bash
vercel --prod
```

- **Repositorio:** https://github.com/riverbonilla1504/vilyou
- **Proyecto en Vercel:** `vilyou` (cuenta `riverflorez04-1854`)
- El link largo de cada versión (`vilyou-xxxx….vercel.app`) pide iniciar sesión en Vercel: **compártele solo** `vilyou.vercel.app`.

---

## El QR

- `extras/qr-vilyou.png` (2160×2700) y `extras/qr-vilyou.svg` (vectorial, para imprimir grande).
- Diseño: corazón pixel rosado, tarjeta de madera y pergamino estilo Stardew con el QR, tulipán en el centro, luna, Urano y jardín de tulipanes y lirios.
- Lleva a `https://vilyou.vercel.app` y se comprobó que se lee en tamaño grande, mediano y pequeño.

---

## Cómo funciona por dentro

**Tecnologías:** Next.js 16 (App Router), React 19, Tailwind CSS 4, framer-motion (animaciones), three.js (universo 3D),
fuentes *Pixelify Sans* y *Press Start 2P*. Sonidos chiptune generados en el navegador; la música son archivos `.m4a`
en `public/musica/` que pasan por WebAudio (`src/lib/music.ts`) para que el fade de entrada y salida funcione en iPhone,
donde Safari no deja cambiar el volumen de un `<audio>`. Funciona con el switch de silencio y se ve en la pantalla de bloqueo.

**Pantallas** (todo vive en una sola página, `src/app/page.tsx`):

1. `LockScreen` → cuenta regresiva hasta `config.desbloqueo`.
2. `RetroLetter` → sobre, candado (`Keypad`), carta y regalo.
3. `BloomTransition` → lluvia de tulipanes y lirios.
4. `UniverseScreen` + `UniverseCanvas` → el universo 3D y sus lugares (`src/components/places/`).

**Carpetas principales:**

```
src/
  app/            página, estilos globales, íconos (apple-icon, icon)
  content/        TODOS los textos editables
  components/
    pixel/        sprites pixel-art (Mía, Pinky, Melody, Cody, tulipán, lirio, luna…)
    universe/     universo 3D (three.js)
    places/       jardín, pastel, juegos, peluches, canción, historia, álbum
    PixelScene    el cielo pixel interactivo de fondo
    LockScreen, RetroLetter, Keypad, DialogueBox, Hotbar, TapBursts…
  lib/            progreso guardado, reloj, sonidos, máquina de escribir
public/ui/        marcos de madera y papel (9-slice)
public/fotos/     las fotos ya achicadas (historia-*, nosotros-*, tu-*, yo-*)
public/musica/    chachacha.m4a, reina-pepiada.m4a y la playlist de Cuco (~59 MB)
extras/           el QR y las fotos originales
```

**Detalles para iPhone:** respeta la isla dinámica y la barra de abajo (zonas seguras), pantalla completa con `100dvh`,
botones grandes para el dedo, el universo limita la resolución para no calentar el celular y se pausa al abrir un lugar,
y se puede agregar a la pantalla de inicio con su ícono de corazón pixel.

**Importante:** el candado y la cuenta regresiva funcionan en el navegador. Alguien que sepa programar podría ver los
textos antes de tiempo leyendo el código; para un regalo está bien, pero no pongas nada secreto de verdad.

---

## Qué se probó y qué no

**Probado** (en el navegador, tamaño iPhone 16 y computador): cuenta regresiva y su final, todas las interacciones del
inicio (Mía, sobre, contador, luna, nubes, flores, corazones al tocar), candado con código correcto e incorrecto,
carta y regalo, transición de flores, universo (frases, el 7 y secretos al tocarlos), jardín, pastel tocando las velas,
Wordle, memoria, peluches, nuestra canción en su tocadiscos, historia con sus secretos y el álbum. También:
diálogo del tulipán con la X, la luna que se vuelve disco, Chachacha + dedicatoria, pausar/seguir, el paso a la
playlist al terminar la canción y que la playlist suene al volver a entrar. TypeScript,
lint y build de producción pasan sin errores.

**Sin probar en un iPhone real:** el vuelo de la cámara al tocar un planeta (se probó abriendo los lugares directo),
soplar las velas con el micrófono (el navegador de pruebas bloquea el micrófono) y cómo se siente el rendimiento del 3D
en el teléfono, y la música en Safari de iPhone (que arranque con el primer toque al volver a entrar y que el fade se sienta suave).
