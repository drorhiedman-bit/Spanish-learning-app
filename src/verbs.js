// Verb conjugation module (Latin American: no vosotros).
const PERSONS = [
  { k: 0, es: ["yo"], he: "אני" },
  { k: 1, es: ["tú"], he: "אתה/את" },
  { k: 2, es: ["él", "ella", "usted"], he: "הוא/היא/אתה (רשמי)" },
  { k: 3, es: ["nosotros"], he: "אנחנו" },
  { k: 4, es: ["ellos", "ellas", "ustedes"], he: "הם/הן/אתם" }
];
const TENSES = {
  presente: { en: "I speak / I do", es: "Presente", he: "הווה", lvl: 1, marker: "Todos los días,", ex: "Hablo español todos los días.",
    use: "פעולה שקורית עכשיו, הרגל, או עובדה קבועה. בספרדית גם לעתיד קרוב: «Salgo mañana».",
    form: "-ar: -o, -as, -a, -amos, -an · -er: -o, -es, -e, -emos, -en · -ir: -o, -es, -e, -imos, -en", markers: "todos los días, siempre, normalmente, ahora" },
  preterito: { en: "I spoke (finished, at a specific time)", es: "Pretérito (indefinido)", he: "עבר מושלם", lvl: 1, marker: "Ayer,", ex: "Ayer comí en un restaurante.",
    use: "פעולה שהתחילה והסתיימה בעבר, בנקודת זמן מוגדרת. «מה קרה?»",
    form: "-ar: -é, -aste, -ó, -amos, -aron · -er/-ir: -í, -iste, -ió, -imos, -ieron", markers: "ayer, anoche, el año pasado, una vez, en 2020" },
  imperfecto: { en: "I used to speak / I was speaking", es: "Imperfecto", he: "עבר מתמשך", lvl: 2, marker: "Cuando era joven,", mid: "siempre", ex: "Cuando era niño, vivía en el campo.",
    use: "רקע, תיאור או הרגל בעבר: «הייתי נוהג…», «היה…». לא מתי זה נגמר אלא איך זה היה.",
    form: "-ar: -aba, -abas, -aba, -ábamos, -aban · -er/-ir: -ía, -ías, -ía, -íamos, -ían", markers: "siempre, cada día, de niño, mientras, antes" },
  perfecto: { en: "I have spoken", es: "Pretérito perfecto", he: "עבר שקשור להווה", lvl: 2, marker: "Esta semana,", ex: "Este año he aprendido mucho.",
    use: "פעולה בעבר שעדיין קשורה להיום (היום, השבוע, אי פעם). haber + participio.",
    form: "he, has, ha, hemos, han + -ado / -ido", markers: "hoy, esta semana, este año, ya, todavía no, alguna vez" },
  gerundio: { en: "I am speaking (right now)", es: "Estar + gerundio", he: "קורה עכשיו", lvl: 1, marker: "Ahora mismo,", ex: "Ahora mismo estoy hablando con mi amigo.",
    use: "רק למה שקורה ממש ברגע הזה. estar (estoy, estás, está…) + הפועל עם ‎-ando/‎-iendo. כמו ב־Language Transfer: לא משתמשים בזה לעתיד («Salgo mañana», לא «estoy saliendo mañana»).",
    form: "estoy, estás, está, estamos, están + gerundio · -ar → -ando (hablando) · -er/-ir → -iendo (comiendo, viviendo) · ir → yendo · decir → diciendo · dormir → durmiendo", markers: "ahora, ahora mismo, en este momento" },
  pluscuamperfecto: { en: "I had spoken (before something else in the past)", es: "Pluscuamperfecto", he: "עבר שלפני העבר", lvl: 2, marker: "Cuando llegaste,", mid: "ya", ex: "Cuando llegué, la fiesta ya había empezado.",
    use: "משהו שכבר קרה לפני רגע אחר בעבר: «כשהגעתי, הם כבר אכלו». haber בעבר + participio.",
    form: "había, habías, había, habíamos, habían + -ado / -ido", markers: "ya, todavía no, antes, cuando llegué" },
  ira: { en: "I'm going to speak", es: "Ir a + infinitivo", he: "עתיד קרוב", lvl: 1, marker: "Mañana,", ex: "Mañana voy a correr en el parque.",
    use: "הדרך הכי נפוצה ביומיום לדבר על תוכניות: voy a + שם פועל. מאוד נפוץ בכל אמריקה הלטינית.",
    form: "voy, vas, va, vamos, van + a + infinitivo", markers: "mañana, esta noche, el fin de semana, pronto" },
  futuro: { en: "I will speak", es: "Futuro", he: "עתיד", lvl: 2, marker: "El año que viene,", ex: "El mes que viene viajaré a Ecuador.",
    use: "מה יקרה בעתיד, תחזית או הבטחה. ביום־יום משתמשים הרבה גם ב־ir a + שם פועל.",
    form: "infinitivo + -é, -ás, -á, -emos, -án", markers: "mañana, el año que viene, pronto, algún día" },
  condicional: { en: "I would speak", es: "Condicional", he: "תנאי (הייתי…)", lvl: 3, marker: "Con más tiempo,", ex: "Con más dinero, viajaría por todo el mundo.",
    use: "«הייתי עושה…»: מצב היפותטי, בקשה מנומסת, או עצה («yo que tú, iría»).",
    form: "infinitivo + -ía, -ías, -ía, -íamos, -ían", markers: "si tuviera…, con más…, me gustaría, yo que tú" },
  subjuntivo: { en: "(that) I speak — after quiero que, ojalá…", es: "Presente de subjuntivo", he: "סוביונקטיב (הווה)", lvl: 3, marker: "Es importante que", ex: "Quiero que vengas a la fiesta.",
    use: "אחרי רצון, רגש, ספק או המלצה כלפי מישהו אחר: quiero que, ojalá, es importante que, cuando (לעתיד).",
    form: "raíz de «yo» (tengo → teng-) · -ar → -e, -es, -e, -emos, -en · -er/-ir → -a, -as, -a, -amos, -an", markers: "quiero que, ojalá, espero que, es importante que, para que" }
};
const TENSE_ORDER = ["presente", "gerundio", "preterito", "imperfecto", "perfecto", "pluscuamperfecto", "ira", "futuro", "condicional", "subjuntivo"];
const DEFAULT_CJ = ["presente", "gerundio", "preterito", "perfecto", "ira", "futuro"];
const EXTRA_TENSES = {};
const VERBS = [
  { inf: "hablar", en: "to speak", c: "con mis amigos" },
  { inf: "trabajar", en: "to work", c: "en una oficina" },
  { inf: "comer", en: "to eat", c: "en casa" },
  { inf: "aprender", en: "to learn", c: "algo nuevo" },
  { inf: "vivir", en: "to live", c: "en Lima" },
  { inf: "escribir", en: "to write", c: "un mensaje", part: "escrito" },
  { inf: "correr", en: "to run", c: "en el parque" },
  { inf: "caminar", en: "to walk", c: "por la ciudad" },
  { inf: "bailar", en: "to dance", c: "salsa" },
  { inf: "tomar", en: "to drink, to take", c: "un tinto" },
  { inf: "manejar", en: "to drive", c: "el carro" },
  { inf: "llegar", en: "to arrive", c: "a tiempo", irr: true,
    preterito: ["llegué", "llegaste", "llegó", "llegamos", "llegaron"], subjuntivo: ["llegue", "llegues", "llegue", "lleguemos", "lleguen"] },
  { inf: "ser", noGer: true, en: "to be (essence)", c: "muy feliz", irr: true,
    presente: ["soy", "eres", "es", "somos", "son"], preterito: ["fui", "fuiste", "fue", "fuimos", "fueron"], imperfecto: ["era", "eras", "era", "éramos", "eran"], subjuntivo: ["sea", "seas", "sea", "seamos", "sean"] },
  { inf: "estar", noGer: true, en: "to be (state/place)", c: "en casa", irr: true,
    presente: ["estoy", "estás", "está", "estamos", "están"], preterito: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvieron"], subjuntivo: ["esté", "estés", "esté", "estemos", "estén"] },
  { inf: "ir", en: "to go", c: "al mercado", irr: true, ger: "yendo",
    presente: ["voy", "vas", "va", "vamos", "van"], preterito: ["fui", "fuiste", "fue", "fuimos", "fueron"], imperfecto: ["iba", "ibas", "iba", "íbamos", "iban"], subjuntivo: ["vaya", "vayas", "vaya", "vayamos", "vayan"] },
  { inf: "tener", noGer: true, en: "to have", c: "mucho trabajo", irr: true, fut: "tendr",
    presente: ["tengo", "tienes", "tiene", "tenemos", "tienen"], preterito: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvieron"] },
  { inf: "hacer", en: "to do, to make", c: "la tarea", irr: true, fut: "har", part: "hecho",
    presente: ["hago", "haces", "hace", "hacemos", "hacen"], preterito: ["hice", "hiciste", "hizo", "hicimos", "hicieron"] },
  { inf: "poder", noGer: true, en: "can, to be able", c: "salir temprano", irr: true, fut: "podr", ger: "pudiendo",
    presente: ["puedo", "puedes", "puede", "podemos", "pueden"], preterito: ["pude", "pudiste", "pudo", "pudimos", "pudieron"], subjuntivo: ["pueda", "puedas", "pueda", "podamos", "puedan"] },
  { inf: "querer", noGer: true, en: "to want", c: "un café", irr: true, fut: "querr",
    presente: ["quiero", "quieres", "quiere", "queremos", "quieren"], preterito: ["quise", "quisiste", "quiso", "quisimos", "quisieron"], subjuntivo: ["quiera", "quieras", "quiera", "queramos", "quieran"] },
  { inf: "decir", en: "to say, to tell", c: "la verdad", irr: true, fut: "dir", part: "dicho", ger: "diciendo",
    presente: ["digo", "dices", "dice", "decimos", "dicen"], preterito: ["dije", "dijiste", "dijo", "dijimos", "dijeron"] },
  { inf: "venir", en: "to come", c: "a la fiesta", irr: true, fut: "vendr", ger: "viniendo",
    presente: ["vengo", "vienes", "viene", "venimos", "vienen"], preterito: ["vine", "viniste", "vino", "vinimos", "vinieron"] },
  { inf: "saber", noGer: true, en: "to know (facts)", c: "la respuesta", irr: true, fut: "sabr",
    presente: ["sé", "sabes", "sabe", "sabemos", "saben"], preterito: ["supe", "supiste", "supo", "supimos", "supieron"], subjuntivo: ["sepa", "sepas", "sepa", "sepamos", "sepan"] },
  { inf: "poner", en: "to put", c: "la mesa", irr: true, fut: "pondr", part: "puesto",
    presente: ["pongo", "pones", "pone", "ponemos", "ponen"], preterito: ["puse", "pusiste", "puso", "pusimos", "pusieron"] },
  { inf: "salir", en: "to go out, to leave", c: "con Ana", irr: true, fut: "saldr",
    presente: ["salgo", "sales", "sale", "salimos", "salen"] },
  { inf: "dar", en: "to give", c: "un regalo", irr: true,
    presente: ["doy", "das", "da", "damos", "dan"], preterito: ["di", "diste", "dio", "dimos", "dieron"], subjuntivo: ["dé", "des", "dé", "demos", "den"] },
  { inf: "ver", en: "to see, to watch", c: "una película", irr: true, part: "visto",
    presente: ["veo", "ves", "ve", "vemos", "ven"], preterito: ["vi", "viste", "vio", "vimos", "vieron"], imperfecto: ["veía", "veías", "veía", "veíamos", "veían"] },
  { inf: "volver", en: "to return", c: "a casa", irr: true, part: "vuelto",
    presente: ["vuelvo", "vuelves", "vuelve", "volvemos", "vuelven"], subjuntivo: ["vuelva", "vuelvas", "vuelva", "volvamos", "vuelvan"] },
  { inf: "dormir", en: "to sleep", c: "ocho horas", irr: true, ger: "durmiendo",
    presente: ["duermo", "duermes", "duerme", "dormimos", "duermen"], preterito: ["dormí", "dormiste", "durmió", "dormimos", "durmieron"], subjuntivo: ["duerma", "duermas", "duerma", "durmamos", "duerman"] },
  { inf: "pensar", en: "to think", c: "en el viaje", irr: true,
    presente: ["pienso", "piensas", "piensa", "pensamos", "piensan"], subjuntivo: ["piense", "pienses", "piense", "pensemos", "piensen"] }
];
const END = {
  presente: { ar: ["o", "as", "a", "amos", "an"], er: ["o", "es", "e", "emos", "en"], ir: ["o", "es", "e", "imos", "en"] },
  preterito: { ar: ["é", "aste", "ó", "amos", "aron"], er: ["í", "iste", "ió", "imos", "ieron"], ir: ["í", "iste", "ió", "imos", "ieron"] },
  imperfecto: { ar: ["aba", "abas", "aba", "ábamos", "aban"], er: ["ía", "ías", "ía", "íamos", "ían"], ir: ["ía", "ías", "ía", "íamos", "ían"] },
  futuro: ["é", "ás", "á", "emos", "án"],
  condicional: ["ía", "ías", "ía", "íamos", "ían"]
};
const HABER = ["he", "has", "ha", "hemos", "han"];
const vClass = v => v.inf.slice(-2) === "ír" ? "ir" : v.inf.slice(-2);
const vStem = v => v.inf.slice(0, -2);
function participle(v) { return v.part || vStem(v) + (vClass(v) === "ar" ? "ado" : "ido"); }
function gerund(v) { return v.ger || vStem(v) + (vClass(v) === "ar" ? "ando" : "iendo"); }
function conjugate(v, t) {
  if (v[t]) return v[t].slice();
  const cl = vClass(v), st = vStem(v);
  if (t === "presente" || t === "preterito" || t === "imperfecto") return END[t][cl].map(e => st + e);
  if (t === "futuro") return END.futuro.map(e => (v.fut || v.inf) + e);
  if (t === "condicional") return END.condicional.map(e => (v.fut || v.inf) + e);
  if (t === "perfecto") return HABER.map(h => h + " " + participle(v));
  if (t === "pluscuamperfecto") return ["había", "habías", "había", "habíamos", "habían"].map(h => h + " " + participle(v));
  if (t === "gerundio") return ["estoy", "estás", "está", "estamos", "están"].map(h => h + " " + gerund(v));
  if (t === "ira") return ["voy", "vas", "va", "vamos", "van"].map(h => h + " a " + v.inf);
  if (t === "subjuntivo") {
    const yo = conjugate(v, "presente")[0];
    const base = yo.endsWith("o") ? yo.slice(0, -1) : st;
    const e = cl === "ar" ? ["e", "es", "e", "emos", "en"] : ["a", "as", "a", "amos", "an"];
    return e.map(x => base + x);
  }
  return [];
}

// Voseo (Argentina, Uruguay, Medellín…). Present: drop -r, stress the ending (hablás, comés, vivís).
// Other tenses use the tú form (in Argentina: subjuntivo "que vos hables" is the standard spoken form).
const VOS = { k: 5, es: ["vos"], he: "אתה/את (ארגנטינה, מדג׳ין)" };
const VOS_IRR = { ser: "sos", ir: "vas", dar: "das", ver: "ves" };
function vosForm(v, t) {
  const tu = conjugate(v, t)[1];
  if (t === "presente") {
    if (VOS_IRR[v.inf]) return VOS_IRR[v.inf];
    const cl = vClass(v); return vStem(v) + (cl === "ar" ? "ás" : cl === "er" ? "és" : "ís");
  }
  return tu;
}
function allForms(v, t, vos) { const f = conjugate(v, t); if (vos) f.push(vosForm(v, t)); return f; }
function allPersons(vos) { return vos ? PERSONS.concat([VOS]) : PERSONS; }
