/**
 * 💌  CARTAS SELLADAS
 * ─────────────────────────────────────────────────────────────
 * Cartas que ella ve cerradas con candado y una cuenta regresiva, y que se
 * abren solas en su fecha (a medianoche, con la hora de su celular).
 * Agrega todas las que quieras. Escríbelas antes de su fecha: hasta ese día
 * ella solo ve el sobre cerrado.
 */
export type CartaSellada = {
  /** Cuándo se abre: "AÑO-MES-DÍATHORA:MIN:SEG". */
  abre: string;
  /** Lo que se ve en el sobre (también antes de abrirse). */
  titulo: string;
  saludo: string;
  parrafos: string[];
  firma: string;
};

export const cartasSelladas: CartaSellada[] = [
  {
    abre: "2026-11-07T00:00:00",
    titulo: "Un año desde que nos conocimos",
    saludo: "Mi vida linda esta carta es para ti,",
    parrafos: [
      "Hoy cumplimos 9 meses mi cielooooo, el tiempo pasa tan pero tan rápido juntos mi amorcito linda, que no puedo creer que hace un año exactamente nos conocimos mi cielo, hace un año llegó la persona más importante de mi vida, tú llegaste a mi vida mi cielo, desde ese día ha sido todo felicidad mi amorcito, no tengo palabras suficientes para expresarte todo lo que siento mi cielo.",
      "Para mí es un año entero de felicidad y alegría contigo mi vida, podrá no significar mucho en número mi amorcito pero si significa mucho para mí, porque exactamente hace un año mi vida cambió para bien, ahora soy el hombre más feliz del mundo y todos los días lo agradezco porque la lotería que me saqué contigo no cualquiera se la gana.",
      "Tener una mujer tan inteligente maravillosa hermosa como tú mi cielo, eres literalmente un sueño hecho realidad mi vida linda no puedo ni describir cuán feliz estoy contigo a mi lado, lo único que hago todo el día es pensarte mi cielo, siempre estás metida en mi mente tú ya sabes que es tu segunda casa mi vida, y créeme que en todo este año entero que hemos pasado juntos, mes cada día cada hora cada minuto y segundo lo único que ha pasado es crecer mi amor por ti.",
      "No puedo vivir sin ti sin mi niña preciosa mi mujer de mis sueños, mi futura esposita, la mamá de nuestros hijos, tú eres mi todo mi cielo y perdón si a veces la cago y depronto sin querer te lastimo pero enserio que nunca más quisiera que pase eso, yo quiero ser tu felicidad y tu lugar seguro así como tú lo eres en cada momento para mí.",
      "Este solo es un año más de los muchos que vamos a estar junticos, porque nos espera toda una vida juntos y se que con mucho amor y esfuerzo lo conseguiremos porque los dos queremos un futuro precioso juntos, felices 9 meses mi cielito hermosa, lo eres todo para mí y quiero que esta cartica se quede inmortalizada para ti.",
      "Espero que si te acuerdes de abrir esta cartica porque la hice con mucho amor mi cielo, pero yo sé que si mi cielo, que la esperas con muchas ansias así como yo espero con muchas ansias nuestro día especial del mes y lo seguiré haciendo hasta el fin del tiempo del universo.",
      "Te amoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
    ],
    firma: "Tu Esposo",
  },
  {
    abre: "2026-12-07T00:00:00",
    titulo: "10 meses",
    saludo: "Mi cielo:",
    parrafos: ["Escribe aquí la carta de los 10 meses."],
    firma: "Tu Esposo",
  },
  {
    abre: "2027-01-07T00:00:00",
    titulo: "11 meses",
    saludo: "Mi vida:",
    parrafos: ["Escribe aquí la carta de los 11 meses."],
    firma: "Tu Esposo",
  },
  {
    abre: "2027-02-07T00:00:00",
    titulo: "¡Un año juntos!",
    saludo: "Mi amor:",
    parrafos: ["Escribe aquí la carta de nuestro primer año."],
    firma: "Tu Esposo",
  },
];

/** Lo que dices cuando hay una carta nueva para abrir. */
export const avisoCartaNueva = "Psst… hoy se abrió una carta sellada para ti. Está en la mochila 💌";
