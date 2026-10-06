/**
 * Pixel-art sprites drawn as text grids.
 * Each character maps to a color in `palette`; "." is transparent.
 */
export type Sprite = {
  grid: readonly string[];
  palette: Readonly<Record<string, string>>;
};

const heart: Sprite = {
  grid: [
    "..KKK...KKK..",
    ".KRRRK.KRRRK.",
    "KRWWRRKRRRRRK",
    "KRWRRRRRRRRRK",
    "KRRRRRRRRRRDK",
    ".KRRRRRRRRDK.",
    "..KRRRRRRDK..",
    "...KRRRRDK...",
    "....KRRDK....",
    ".....KDK.....",
    "......K......",
  ],
  palette: { K: "#5a1630", R: "#ff5d8f", W: "#ffd6e4", D: "#d93a6e" },
};

const heartSmall: Sprite = {
  grid: [
    ".RR.RR.",
    "RWRRRRR",
    "RRRRRRR",
    ".RRRRR.",
    "..RRR..",
    "...R...",
  ],
  palette: { R: "#ff6f9a", W: "#ffd6e4" },
};

const envelope: Sprite = {
  grid: [
    "KKKKKKKKKKKKKK",
    "KDLLLLLLLLLLDK",
    "KLDLLLLLLLLDLK",
    "KLLDLLLLLLDLLK",
    "KLLLDLLLLDLLLK",
    "KLLLLDRRDLLLLK",
    "KLLLLRRRRLLLLK",
    "KLLLLLRRLLLLLK",
    "KLLLLLLLLLLLLK",
    "KKKKKKKKKKKKKK",
  ],
  palette: { K: "#4a2410", L: "#fff1d0", D: "#c9a26b", R: "#e0405f" },
};

const tulip: Sprite = {
  grid: [
    ".K...K...K.",
    "KRK.KRK.KRK",
    "KRRKRRRKRRK",
    "KRRRRRRRRRK",
    "KRLRRRRRRDK",
    "KRLRRRRRRDK",
    ".KRRRRRRDK.",
    "..KRRRRDK..",
    "...KKGKK...",
    "....KGK....",
    ".KK.KGK.KK.",
    "KGGKKGKKGGK",
    ".KGGGGGGGK.",
    "..KKGGGKK..",
    "....KKK....",
  ],
  palette: { K: "#4a1830", R: "#ff6f9a", L: "#ffc4d6", D: "#d8406f", G: "#5fbf5a" },
};

const uranus: Sprite = {
  grid: [
    "........KKKKK.......",
    "......KKCCCCCKK.....",
    ".....KCLLCCCCCCKVVV.",
    ".....KCLCCCCCCCK...R",
    ".....KLCCCCCCCCK..RS",
    "....VKCCCCCCCCDKRRS.",
    "..VV.KCCCCCCCDRRSS..",
    ".V...KCCCCCRRRSS....",
    "R.....KRRRRSSSK.....",
    "SRRRRRRSSSSKK.......",
    ".SSSSSS.............",
  ],
  palette: {
    K: "#1d3a5a",
    C: "#7fe0ee",
    L: "#d4fbff",
    D: "#3aa8c4",
    R: "#d2b4ff",
    S: "#8f6ad8",
    V: "#7a5cc4",
  },
};

const iceCream: Sprite = {
  grid: [
    "....KKKK....",
    "..KKWWWWKK..",
    ".KWWBWWWWWK.",
    ".KWWWWWBWWK.",
    "KWBWWWWWWWWK",
    "KWWWWBWWWBWK",
    "KWWBWWWWWWWK",
    "KKWWKWWKWWKK",
    ".KOOOOOOOOK.",
    ".KOdOOdOOdK.",
    "..KOOdOOdK..",
    "..KdOOdOOK..",
    "...KOOdOK...",
    "...KOdOOK...",
    "....KOOK....",
    ".....KK.....",
  ],
  palette: { K: "#3a2418", W: "#f6f1e8", B: "#2a2226", O: "#e8a85a", d: "#b8732f" },
};

/** Mía: brown tabby with a white chest, muzzle and paws, and green eyes. */
const cat: Sprite = {
  grid: [
    ".KK........KK.",
    ".KOK......KOK.",
    ".KPOK....KOPK.",
    ".KOOOKKKKOOOK.",
    "KOOSOSOOSOSOOK",
    "KOSKKOSSOKKSOK",
    "KOOKEOOOOKEOOK",
    "KSOOWWPPWWOOSK",
    "KOWWWKWWKWWWOK",
    ".KOWWWKKWWWOK.",
    "..KKWWWWWWKK..",
    "....KKKKKK....",
  ],
  palette: { K: "#2e1f17", O: "#b98450", S: "#5a3a22", W: "#fbf6ee", P: "#f2a0a8", E: "#b8cf5a" },
};

const sunsetMoon: Sprite = {
  grid: [
    "............KK..",
    "...........KMK..",
    "..........KMK...",
    "..........KMMK..",
    "...........KKK..",
    ".....KKKKKK.....",
    "...KKYYYYYYKK...",
    "..KYYYWYYYYOOK..",
    ".KYYYYYYYYYOOOK.",
    "KKKKKKKKKKKKKKKK",
    ".PPPP.PPPPPP.PP.",
    "...PPPP...PPP...",
  ],
  palette: { K: "#3a1a3a", M: "#fff3c0", Y: "#ffd54f", W: "#fff7d6", O: "#ff8a50", P: "#ff9ec0" },
};

const sun: Sprite = {
  grid: [
    "......R......",
    ".R....R....R.",
    "..R.......R..",
    "....KKKKK....",
    "...KYYYYYK...",
    "..KYWWYYYOK..",
    "RRKYWYYYYOKRR",
    "..KYYYYYYOK..",
    "...KYYYOOK...",
    "....KKKKK....",
    "..R.......R..",
    ".R....R....R.",
    "......R......",
  ],
  palette: { K: "#8a4a10", Y: "#ffd54f", W: "#fff6cf", O: "#f5a623", R: "#ffb84d" },
};

const pinky: Sprite = {
  grid: [
    "......KK......",
    ".....KGGK.....",
    "..KK.KGGK.KK..",
    "..KGKKPPKKGK..",
    "...KPPPPPPK...",
    "..KPPPPPPPPK..",
    ".KGPPPPPPPPGK.",
    ".KPPKPPPPKPPK.",
    "KPPPKPPPPKPPPK",
    "KPLPPPPPPPPLPK",
    "KPPPPPKKPPPPPK",
    ".KGPPPPPPPPGK.",
    "..KPPPPPPPPK..",
    "...KKPPPPKK...",
    ".....KKKK.....",
  ],
  palette: { K: "#3b1258", P: "#a95cf0", G: "#6fd36b", L: "#e4c2ff" },
};

const lily: Sprite = {
  grid: [
    "......KKK......",
    ".....KWWWK.....",
    ".....KWPWK.....",
    ".KK..KWPWK..KK.",
    "KLLK.KWPWK.KLLK",
    "KLLLKKWPWKKLLLK",
    ".KLLLWWYWWLLLK.",
    "..KKWYPOPYWKK..",
    ".KWWWWYPYWWWWK.",
    "KWPPWWWWWWWPPWK",
    "KWWPPWWLWWPPWWK",
    ".KWWWKLLLKWWWK.",
    "..KKK.KLK.KKK..",
    "......KLK......",
    ".......K.......",
  ],
  palette: { K: "#5a2a4a", W: "#fff6fb", P: "#ff8fbf", L: "#ffc9df", Y: "#ffd54f", O: "#ff9a3c" },
};

const shackle: Sprite = {
  grid: [
    "..KKKK..",
    ".KGGGGK.",
    "KGK..KGK",
    "KGK..KGK",
    "KGK..KGK",
    "KGK..KGK",
    "KGK..KGK",
  ],
  palette: { K: "#4a2c0c", G: "#d9dde6" },
};

const keyhole: Sprite = {
  grid: [".K.", "KKK", ".K.", ".K."],
  palette: { K: "#3a1a06" },
};

const melody: Sprite = {
  grid: [
    "...KK......KK...",
    "..KPPK....KPPK..",
    "..KPPK....KFFK..",
    "..KPPK....KFFK..",
    "..KPPPK..KPPPK..",
    "..KPPPPKKPPPPK..",
    ".KPPPPPPPPPPPPK.",
    "KPPPPPPPPPPPPPPK",
    "KPPKKKKKKKKKKPPK",
    "KPKWWWWWWWWWWKPK",
    "KPKWKWWWWWWKWKPK",
    "KPKWWWWYYWWWWKPK",
    "KPKWRWWWWWWRWKPK",
    ".KPKWWWWWWWWKPK.",
    "..KKKKKKKKKKKK..",
  ],
  palette: { K: "#4a1f35", P: "#ff9ec7", F: "#ff5d7e", W: "#fffaf6", Y: "#ffd54f", R: "#ffb3c6" },
};

const cody: Sprite = {
  grid: [
    "...........KK...",
    "..........KHK.K.",
    "..........KWKKHK",
    ".........KWWWWK.",
    ".........KWKWWWK",
    "..KKKKKKKWWWWPPK",
    ".KWWWWWWWWWWKKK.",
    "KWWWWWWWWWWWWBK.",
    "KWWWWWWWWWWWKBK.",
    ".KWWWWWWWWWWK.K.",
    ".KWKKWKKKWKKWK..",
    ".KHK.KHK.KHKKHK.",
    ".KK..KK..KK.KK..",
  ],
  palette: { K: "#3e2a1e", W: "#fbf3e6", H: "#c99a62", P: "#ffb3c6", B: "#e8dccb" },
};

const catSleep: Sprite = {
  grid: [
    "....KK..KK......",
    "...KOOKKOOK.....",
    "..KOSOSOSOOK....",
    ".KOOKKOOKKOOKKK.",
    ".KOWWWPWWWOSOSOK",
    "KOOWWWWWOSOOSOOK",
    "KSOOOOOOOOSOOOK.",
    ".KKWWOOOOOOSWK..",
    "...KKKKKKKKKK...",
  ],
  palette: { K: "#2e1f17", O: "#b98450", S: "#5a3a22", W: "#fbf6ee", P: "#f2a0a8" },
};

const seven: Sprite = {
  grid: ["KKKKKKK", "KYYYYYK", "KKKKYYK", "...KYK.", "..KYYK.", "..KYK..", ".KYYK..", ".KYK...", ".KKK..."],
  palette: { K: "#6b3a07", Y: "#ffd54f" },
};

const note: Sprite = {
  grid: [
    "....KKKKK",
    "....KNNNK",
    "....KNKKK",
    "....KNK..",
    "....KNK..",
    "....KNK..",
    ".KKKKNK..",
    "KNNNNNK..",
    "KNNNNNK..",
    "KNNNNK...",
    ".KKKK....",
  ],
  palette: { K: "#2a1440", N: "#b98cff" },
};

const gamepad: Sprite = {
  grid: [
    ".KKKKKKKKKKKK.",
    "KGGGGGGGGGGGGK",
    "KGGKGGGGGGRGGK",
    "KGKKKGGGGRGRGK",
    "KGGKGGGGGGRGGK",
    "KGGGGGKKGGGGGK",
    "KGGGGK..KGGGGK",
    ".KGGK....KGGK.",
    "..KK......KK..",
  ],
  palette: { K: "#24163a", G: "#8f7bd8", R: "#ff6f9a" },
};

const book: Sprite = {
  grid: [
    "KKKKKKKKKKKK",
    "KRRRRRRRRRWK",
    "KRYYYYYYRRWK",
    "KRRRRRRRRRWK",
    "KRRRRHRRRRWK",
    "KRRRHHHRRRWK",
    "KRRRRHRRRRWK",
    "KRRRRRRRRRWK",
    "KKKKKKKKKKWK",
    ".KWWWWWWWWWK",
    ".KKKKKKKKKKK",
  ],
  palette: { K: "#3a1a10", R: "#c0503a", Y: "#ffd54f", H: "#ffb3c6", W: "#fff3dc" },
};

const gift: Sprite = {
  grid: [
    "...KK.KK...",
    "..KRRKRRK..",
    "KKKKKKKKKKK",
    "KPPPPRPPPPK",
    "KKKKKKKKKKK",
    ".KPPPRPPPK.",
    ".KPPPRPPPK.",
    ".KPPPRPPPK.",
    ".KPPPRPPPK.",
    ".KPPPRPPPK.",
    ".KKKKKKKKK.",
  ],
  palette: { K: "#4a1630", R: "#ffd54f", P: "#ff8fb0" },
};

const cake: Sprite = {
  grid: [
    "......F......",
    "......C......",
    "..KKKKKKKKK..",
    ".KWWPWWWPWWK.",
    ".KPPPPPPPPPK.",
    ".KCCCCCCCCCK.",
    "KKKKKKKKKKKKK",
    "KWWPWWWWPWWWK",
    "KPPPPPPPPPPPK",
    "KCCCCCCCCCCCK",
    "KKKKKKKKKKKKK",
  ],
  palette: { K: "#4a2418", W: "#fff6ee", P: "#ff9ec0", C: "#f6d29a", F: "#ffb347" },
};

const pumpkin: Sprite = {
  grid: [
    "......KK....",
    ".....KGK....",
    "..KKKKKKKK..",
    ".KOOKOOKOOK.",
    "KOYYOOOOYYOK",
    "KOYYOOOOYYOK",
    "KOOOOYYOOOOK",
    "KOYOYOOYOYOK",
    ".KOYYYYYYOK.",
    "..KKKKKKKK..",
  ],
  palette: { K: "#2a1206", O: "#ff8a2a", Y: "#ffe066", G: "#5a8a3a" },
};

const pine: Sprite = {
  grid: [
    "....D....",
    "...DGD...",
    "..DGGGD..",
    "...GGG...",
    "..DGGGD..",
    ".DGGLGGD.",
    "..GGGGG..",
    ".DGGGGGD.",
    "DGGLGGGGD",
    ".GGGGGGG.",
    "DGGGGLGGD",
    "DDDDTDDDD",
    "....T....",
    "....T....",
  ],
  palette: { D: "#0d2426", G: "#18403a", L: "#24584a", T: "#26150f" },
};

const cloud: Sprite = {
  grid: [
    "......WWWW......",
    "....WWWWWWWW.WW.",
    "..WWWWWWWWWWWWWW",
    ".WWWWWWWWWWWWWWW",
    "SSSSSSSSSSSSSSSS",
    ".SSSSSSSSSSSSSS.",
  ],
  palette: { W: "#ffffff", S: "#d9cdf2" },
};

const bat: Sprite = {
  grid: [
    "K....KK....K",
    "KK..KKKK..KK",
    "KKKKKYKYKKKK",
    ".KKKKKKKKKK.",
    "..KK.KK.KK..",
    "...K....K...",
  ],
  palette: { K: "#120818", Y: "#ffd34d" },
};

const bird: Sprite = {
  grid: ["K...K", ".K.K.", "..K.."],
  palette: { K: "#2a1030" },
};

const sparkle: Sprite = {
  grid: ["..Y..", ".YWY.", "YWWWY", ".YWY.", "..Y.."],
  palette: { Y: "#ffd86b", W: "#fffbe6" },
};

const moon: Sprite = {
  grid: [
    ".....KKKK.....",
    "...KKMMMMKK...",
    "..KMMMMMMMMK..",
    ".KMMMMMCMMMMK.",
    ".KMMCMMMMMMMK.",
    "KMMCCMMMMMMMSK",
    "KMMMMMMMMCMMSK",
    "KMMMMMMMMMMMSK",
    "KMMMMMCMMMMSSK",
    ".KMMMMMMMMMSK.",
    ".KMMMMMMMMSSK.",
    "..KMMMMMMSSK..",
    "...KKSSSSKK...",
    ".....KKKK.....",
  ],
  palette: { K: "#e9d9a6", M: "#fff7dc", C: "#ecdcaa", S: "#e2d09c" },
};

/** River, Stardew-style portrait: messy dark hair and his black tee. */
const river: Sprite = {
  grid: [
    "................................",
    "............KK..KKK.............",
    "..........KKHHKKHHHKK...........",
    "........KKHHHHHHHHHHHKK.........",
    ".......KHHHhHHHHHHHHHHHK........",
    "......KHHHHHhHHHHHHHHHHHK.......",
    ".....KHHHHHHHHHHHHHhHHHHHK......",
    ".....KHHHhHHHHHHHHHHHHHHHK......",
    ".....KHHHHHHHHHHHHHHHHHHHHK.....",
    ".....KHHHHHhHHHHHHHHHHHHHHK.....",
    ".....KHHHHHhHHHHHHHhHHHHHHK.....",
    ".....KHHHSHHSHHHHHHSHHSHHHK.....",
    ".....KHHHSSSHSSSSSSHSSSHHHK.....",
    ".....KHHHSSHHSSSSSSHHSSHHHK.....",
    ".....KHHsSSWESSSSSSWESSsHHK.....",
    ".....KHHsSSEESSSSSSEESSsHHK.....",
    "......KHKSBBSSSssSSSBBSKHK......",
    "........KSSSSSSSSSSSSSSK........",
    "........KSSSSMSSSSMSSSSK........",
    "........KSSSSSMMMMSSSSSK........",
    ".........KsSSSSSSSSSSsK.........",
    "..........KsSSSSSSSSsK..........",
    "...........KKsSSSSsKK...........",
    "............KsSSSSsK............",
    "........KTTTKssssssKTTTK........",
    "......KTTTTTTTssssTTTTTTTK......",
    "....KTTTTTTTTttttttTTTTTTTTK....",
    "...KTTTtTTTTTTTTTTTTTTTTtTTTK...",
    "..KTTTTTTTTTTTTTTTTTTTTTTTTTTK..",
    ".KTTTTTTTTTTTTTTTTTTTTTTTTTTTTK.",
    ".KTTTTTTTTTTTTTTTTTTTTTTTTTTTTK.",
    "KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTK",
  ],
  palette: { K: "#1e1220", H: "#2b1d1b", h: "#4f3a33", S: "#cf9168", s: "#a9704d", W: "#ffffff", E: "#241510", M: "#7a3a32", B: "#e58a78", T: "#1d1d27", t: "#3a3a4a", L: "#c9566a" },
};

/** River mid-word (mouth open). */
const riverTalk: Sprite = {
  grid: [
    "................................",
    "............KK..KKK.............",
    "..........KKHHKKHHHKK...........",
    "........KKHHHHHHHHHHHKK.........",
    ".......KHHHhHHHHHHHHHHHK........",
    "......KHHHHHhHHHHHHHHHHHK.......",
    ".....KHHHHHHHHHHHHHhHHHHHK......",
    ".....KHHHhHHHHHHHHHHHHHHHK......",
    ".....KHHHHHHHHHHHHHHHHHHHHK.....",
    ".....KHHHHHhHHHHHHHHHHHHHHK.....",
    ".....KHHHHHhHHHHHHHhHHHHHHK.....",
    ".....KHHHSHHSHHHHHHSHHSHHHK.....",
    ".....KHHHSSSHSSSSSSHSSSHHHK.....",
    ".....KHHHSSHHSSSSSSHHSSHHHK.....",
    ".....KHHsSSWESSSSSSWESSsHHK.....",
    ".....KHHsSSEESSSSSSEESSsHHK.....",
    "......KHKSBBSSSssSSSBBSKHK......",
    "........KSSSSSSSSSSSSSSK........",
    "........KSSSSSMMMMSSSSSK........",
    "........KSSSSSMLLMSSSSSK........",
    ".........KsSSSSSSSSSSsK.........",
    "..........KsSSSSSSSSsK..........",
    "...........KKsSSSSsKK...........",
    "............KsSSSSsK............",
    "........KTTTKssssssKTTTK........",
    "......KTTTTTTTssssTTTTTTTK......",
    "....KTTTTTTTTttttttTTTTTTTTK....",
    "...KTTTtTTTTTTTTTTTTTTTTtTTTK...",
    "..KTTTTTTTTTTTTTTTTTTTTTTTTTTK..",
    ".KTTTTTTTTTTTTTTTTTTTTTTTTTTTTK.",
    ".KTTTTTTTTTTTTTTTTTTTTTTTTTTTTK.",
    "KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTK",
  ],
  palette: { K: "#1e1220", H: "#2b1d1b", h: "#4f3a33", S: "#cf9168", s: "#a9704d", W: "#ffffff", E: "#241510", M: "#7a3a32", B: "#e58a78", T: "#1d1d27", t: "#3a3a4a", L: "#c9566a" },
};

/** River blinking. */
const riverBlink: Sprite = {
  grid: [
    "................................",
    "............KK..KKK.............",
    "..........KKHHKKHHHKK...........",
    "........KKHHHHHHHHHHHKK.........",
    ".......KHHHhHHHHHHHHHHHK........",
    "......KHHHHHhHHHHHHHHHHHK.......",
    ".....KHHHHHHHHHHHHHhHHHHHK......",
    ".....KHHHhHHHHHHHHHHHHHHHK......",
    ".....KHHHHHHHHHHHHHHHHHHHHK.....",
    ".....KHHHHHhHHHHHHHHHHHHHHK.....",
    ".....KHHHHHhHHHHHHHhHHHHHHK.....",
    ".....KHHHSHHSHHHHHHSHHSHHHK.....",
    ".....KHHHSSSHSSSSSSHSSSHHHK.....",
    ".....KHHHSSHHSSSSSSHHSSHHHK.....",
    ".....KHHsSSSSSSSSSSSSSSsHHK.....",
    ".....KHHsSEEESSSSSSEEESsHHK.....",
    "......KHKSBBSSSssSSSBBSKHK......",
    "........KSSSSSSSSSSSSSSK........",
    "........KSSSSMSSSSMSSSSK........",
    "........KSSSSSMMMMSSSSSK........",
    ".........KsSSSSSSSSSSsK.........",
    "..........KsSSSSSSSSsK..........",
    "...........KKsSSSSsKK...........",
    "............KsSSSSsK............",
    "........KTTTKssssssKTTTK........",
    "......KTTTTTTTssssTTTTTTTK......",
    "....KTTTTTTTTttttttTTTTTTTTK....",
    "...KTTTtTTTTTTTTTTTTTTTTtTTTK...",
    "..KTTTTTTTTTTTTTTTTTTTTTTTTTTK..",
    ".KTTTTTTTTTTTTTTTTTTTTTTTTTTTTK.",
    ".KTTTTTTTTTTTTTTTTTTTTTTTTTTTTK.",
    "KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTK",
  ],
  palette: { K: "#1e1220", H: "#2b1d1b", h: "#4f3a33", S: "#cf9168", s: "#a9704d", W: "#ffffff", E: "#241510", M: "#7a3a32", B: "#e58a78", T: "#1d1d27", t: "#3a3a4a", L: "#c9566a" },
};

/** Valeria: long wavy caramel hair, rosy cheeks and her polka-dot top. */
const valeria: Sprite = {
  grid: [
    "................................",
    "............KKKKKKKK............",
    "..........KKHHHHHHhhKK..........",
    ".........KHHHHHHHHhhHHK.........",
    "........KHHHHHHHHHHhhHHK........",
    ".......KHHHHHHHHHHHHHhHHK.......",
    "......KHHHHHHHHHHHHHHHhHHK......",
    ".....KHHhHHHHHHHHHHHHHhhHHK.....",
    ".....KHHhHHHSSHHHHHHHHhHHHK.....",
    ".....KHhHHSSSSSSHHHHHHHHhHK.....",
    ".....KHhHSSSSSSSSSHHHHHHcHK.....",
    ".....KHcHSSSSSSSSSSSHHHHcHK.....",
    ".....KHcHSdddSSSSSSdddHHcHK.....",
    ".....KHcHSKKKSSSSSSKKKSHcHK.....",
    ".....KHcHSWEESSSSSSWEESHcHK.....",
    ".....KHcHSEEESSSSSSEEESHcHK.....",
    ".....KHcHSBBSSSssSSSBBSHcHK.....",
    ".....KHcHSSSSSSSSSSSSSSHcHK.....",
    ".....KHcHSSSSSLLLLSSSSSHcHK.....",
    ".....KHcHSSSSSSLLSSSSSSHcHK.....",
    ".....KHcHKsSSSSSSSSSSsKHcHK.....",
    ".....KHcHHKsSSSSSSSSsKHHcHK.....",
    ".....KHHcHHKKsSSSSsKKHHcHHK.....",
    "....KHHcHHHHKsSSSSsKHHHHcHHK....",
    "....KHHcHHHHTsSSSSsTHHHHcHHK....",
    "...KHHHcHHHHTTSSSSTTHHHHcHHHK...",
    "..KHHHcHHHHTTTTSSTTTTHHHHcHHHK..",
    ".KHHcHHHHTTPTTTTTTTTTPTTHHHHcHK.",
    ".KHcHHHHTTTTTTPTTTTTTTTTTHHHcHK.",
    ".KcHHHHTTPTTTTTTTTTPTTTTTTHHHcK.",
    "KHHHcTTTTTTTTPTTTTTTTTTTPTTTcHHK",
    "KHcHTTTPTTTTTTTTTTPTTTTTTTTTHcHK",
  ],
  palette: { K: "#2a1418", H: "#6e4029", h: "#a9734b", c: "#c99260", S: "#f3c9a8", s: "#d9a382", W: "#ffffff", E: "#3a2016", d: "#5a3020", B: "#f49b9b", L: "#d65a6c", T: "#1d1a24", P: "#efe8f3" },
};

/** Valeria blinking. */
const valeriaBlink: Sprite = {
  grid: [
    "................................",
    "............KKKKKKKK............",
    "..........KKHHHHHHhhKK..........",
    ".........KHHHHHHHHhhHHK.........",
    "........KHHHHHHHHHHhhHHK........",
    ".......KHHHHHHHHHHHHHhHHK.......",
    "......KHHHHHHHHHHHHHHHhHHK......",
    ".....KHHhHHHHHHHHHHHHHhhHHK.....",
    ".....KHHhHHHSSHHHHHHHHhHHHK.....",
    ".....KHhHHSSSSSSHHHHHHHHhHK.....",
    ".....KHhHSSSSSSSSSHHHHHHcHK.....",
    ".....KHcHSSSSSSSSSSSHHHHcHK.....",
    ".....KHcHSdddSSSSSSdddHHcHK.....",
    ".....KHcHSSSSSSSSSSSSSSHcHK.....",
    ".....KHcHSSSSSSSSSSSSSSHcHK.....",
    ".....KHcHSKKKSSSSSSKKKSHcHK.....",
    ".....KHcHSBBSSSssSSSBBSHcHK.....",
    ".....KHcHSSSSSSSSSSSSSSHcHK.....",
    ".....KHcHSSSSSLLLLSSSSSHcHK.....",
    ".....KHcHSSSSSSLLSSSSSSHcHK.....",
    ".....KHcHKsSSSSSSSSSSsKHcHK.....",
    ".....KHcHHKsSSSSSSSSsKHHcHK.....",
    ".....KHHcHHKKsSSSSsKKHHcHHK.....",
    "....KHHcHHHHKsSSSSsKHHHHcHHK....",
    "....KHHcHHHHTsSSSSsTHHHHcHHK....",
    "...KHHHcHHHHTTSSSSTTHHHHcHHHK...",
    "..KHHHcHHHHTTTTSSTTTTHHHHcHHHK..",
    ".KHHcHHHHTTPTTTTTTTTTPTTHHHHcHK.",
    ".KHcHHHHTTTTTTPTTTTTTTTTTHHHcHK.",
    ".KcHHHHTTPTTTTTTTTTPTTTTTTHHHcK.",
    "KHHHcTTTTTTTTPTTTTTTTTTTPTTTcHHK",
    "KHcHTTTPTTTTTTTTTTPTTTTTTTTTHcHK",
  ],
  palette: { K: "#2a1418", H: "#6e4029", h: "#a9734b", c: "#c99260", S: "#f3c9a8", s: "#d9a382", W: "#ffffff", E: "#3a2016", d: "#5a3020", B: "#f49b9b", L: "#d65a6c", T: "#1d1a24", P: "#efe8f3" },
};

/** The record that replaces the moon once the song is dedicated. */
const vinyl: Sprite = {
  grid: [
    "...........KKKK...........",
    "........KKKDDDDKKK........",
    "......KKDDGGGGGGDDKK......",
    ".....KDSSGDDDDDDGGGDK.....",
    "....KDSSDDGGGGGGDDGGDK....",
    "...KDSDDSSDDDDDDGGDDGDK...",
    "..KDSDDSDDGGGGGGDDGDDGDK..",
    "..KSSDSDDSGDLLDGGDDGDGGK..",
    ".KDSDSDDSDLPlPlLDGDDGDGDK.",
    ".KDSDSDSDLlPPPLlLDGDGDGDK.",
    ".KGDGDSSLlLLPLLLlLGGDGDGK.",
    "KDGDGDGDlLLLLLLLLlDGDGDGDK",
    "KDGDGDGLlLLLKKLLLlLGDGDGDK",
    "KDGDGDGLlLLLKKLLLlLGDGDGDK",
    "KDGDGDGDlLLLLLLLLlDGDGDGDK",
    ".KGDGDGGLlLLLLLLlLSSDGDGK.",
    ".KDGDGDGDLlWWWWlLDSDSDSDK.",
    ".KDGDGDDGDLllllLDSDDSDSDK.",
    "..KGGDGDDGGDLLDGSDDSDSSK..",
    "..KDGDDGDDGGGGGGDDSDDSDK..",
    "...KDGDDGGDDDDDDSSDDSDK...",
    "....KDGGDDGGGGGGDDSSDK....",
    ".....KDGGGDDDDDDGSSDK.....",
    "......KKDDGGGGGGDDKK......",
    "........KKKDDDDKKK........",
    "...........KKKK...........",
  ],
  palette: { K: "#0b0812", D: "#1a1326", G: "#2c2140", L: "#a65cf0", l: "#7d3bc6", P: "#ff8fc0", W: "#f3e6ff", S: "#6a5890" },
};

/** The tonearm that rests on the record. */
const tonearm: Sprite = {
  grid: [
    "..........KKK.",
    ".........KSSSK",
    ".........KSWSK",
    ".........KSSSK",
    "..........KAK.",
    "..........KAK.",
    "..........KAK.",
    ".........KAK..",
    ".........KAK..",
    "........KAK...",
    "........KAK...",
    ".......KAK....",
    ".......KAK....",
    "......KAK.....",
    "......KAK.....",
    ".....KAK......",
    ".....KAK......",
    "....KAK.......",
    "...KHHHK......",
    "...KHHHK......",
    "....KKK.......",
  ],
  palette: { K: "#1c1228", S: "#bdb3d0", W: "#ffffff", A: "#e2dbef", H: "#ff8fc0" },
};

/** Mía awake, sitting and looking to the right (at the envelope). */
const catSit: Sprite = {
  grid: [
    "..........K....K..",
    ".........KOK..KOK.",
    ".........KOOKKOOK.",
    "........KOSOSOSOOK",
    "........KOOOOOOOOK",
    "........KOOOEKOEKK",
    "........KOOWWWPWWK",
    ".........KWWWKWWK.",
    "......KKKOWWWWWK..",
    ".....KOOSOWWWWWK..",
    "....KOOSOOWWWWK...",
    "...KOSOOOOWWWWK...",
    "...KOOSOOOOWWOK...",
    "KK.KOOOOOOOOOOK...",
    "KOKKOOOOWWOWWOK...",
    ".KOOKKKKKKKKKKK...",
  ],
  palette: { K: "#2e1f17", O: "#b98450", S: "#5a3a22", W: "#fbf6ee", P: "#f2a0a8", E: "#b8cf5a" },
};

export const sprites = {
  heart,
  heartSmall,
  envelope,
  tulip,
  uranus,
  iceCream,
  cat,
  sunsetMoon,
  sun,
  pinky,
  pumpkin,
  pine,
  cloud,
  bat,
  bird,
  sparkle,
  moon,
  lily,
  shackle,
  keyhole,
  melody,
  cody,
  catSleep,
  seven,
  note,
  gamepad,
  book,
  gift,
  cake,
  river,
  riverTalk,
  riverBlink,
  valeria,
  valeriaBlink,
  vinyl,
  tonearm,
  catSit,
} satisfies Record<string, Sprite>;

export type SpriteName = keyof typeof sprites;
