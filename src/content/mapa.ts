/**
 * 🗺  EL MAPA DE NUESTROS LUGARES
 * (Si dejas `nombre` o `frase` vacíos (""), en la foto sale solo la fecha.)
 * ─────────────────────────────────────────────────────────────
 * Un mapita pixel con un pin por cada lugar donde nos tomamos fotos (salió
 * de la ubicación guardada en las fotos). Ponle a cada uno su nombre de
 * verdad y una frase. `x` y `y` son la posición en el mapa (0 a 100).
 * Al visitar todos los pines, ella gana una canción.
 */
export type Lugar = {
  nombre: string;
  fecha: string;
  frase: string;
  x: number;
  y: number;
  fotos: string[];
};

export const lugares: Lugar[] = [
  {
    nombre: "Disfrutando el día junticos",
    fecha: "21 de junio",
    frase: "Un día solo para nosotros, riéndonos de todo y queriéndonos un montón.",
    x: 66,
    y: 34,
    fotos: ["/fotos/historia-1.jpg", "/fotos/nosotros-01.jpg"],
  },
  {
    nombre: "",
    fecha: "28 de junio",
    frase: "",
    x: 72,
    y: 48,
    fotos: ["/fotos/tu-01.jpg", "/fotos/tu-02.jpg", "/fotos/tu-03.jpg", "/fotos/tu-04.jpg"],
  },
  {
    nombre: "",
    fecha: "20 de julio",
    frase: "",
    x: 86,
    y: 84,
    fotos: ["/fotos/historia-2.jpg", "/fotos/nosotros-02.jpg", "/fotos/nosotros-03.jpg"],
  },
  {
    nombre: "",
    fecha: "1 de agosto",
    frase: "",
    x: 34,
    y: 12,
    fotos: ["/fotos/nosotros-04.jpg"],
  },
  {
    nombre: "",
    fecha: "5 de septiembre",
    frase: "",
    x: 57,
    y: 47,
    fotos: ["/fotos/tu-05.jpg"],
  },
  {
    nombre: "El mirador",
    fecha: "7 de septiembre",
    frase: "Donde pasamos nuestra primera noche juntos, la más especial de todas.",
    x: 50,
    y: 16,
    fotos: [
      "/fotos/historia-3.jpg",
      "/fotos/nosotros-05.jpg",
      "/fotos/historia-5.jpg",
      "/fotos/nosotros-06.jpg",
      "/fotos/nosotros-07.jpg",
      "/fotos/tu-06.jpg",
      "/fotos/historia-4.jpg",
    ],
  },
  {
    nombre: "La niña más preciosa del mundo haciendo prácticas",
    fecha: "10 de septiembre",
    frase: "Toda una profesional, y yo el novio más orgulloso del mundo.",
    x: 64,
    y: 60,
    fotos: ["/fotos/tu-07.jpg"],
  },
  {
    nombre: "Noche conociendo más a mi familia",
    fecha: "16 de septiembre",
    frase: "Gracias por querer a los míos como si fueran tuyos.",
    x: 79,
    y: 63,
    fotos: ["/fotos/nosotros-08.jpg"],
  },
  {
    nombre: "",
    fecha: "4 de octubre",
    frase: "",
    x: 13,
    y: 86,
    fotos: ["/fotos/nosotros-09.jpg", "/fotos/nosotros-10.jpg"],
  },
];

export const textosMapa = {
  titulo: "Nuestros lugares",
  ayuda: "Toca un corazón para ver ese lugar",
  completo: "¡Visitaste todos nuestros lugares! Faltan muchos más por conocer juntos.",
};
