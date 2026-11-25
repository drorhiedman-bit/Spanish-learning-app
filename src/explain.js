// Explanations for the tense drill: when the tense is used, its pattern, how this exact answer is
// built, and — after a mistake — what the chosen option actually is.
const TENSE_RULES = {
  presente: { when: "Habits, facts, things that happen in general — and near-future plans (\"Salgo mañana\").", whenEs: "Para hábitos, hechos y planes cercanos.",
    pattern: "stem + -o, -as/-es, -a/-e, -amos/-emos/-imos, -an/-en" },
  gerundio: { when: "Only for an action happening right now, at this very moment — never for the future.", whenEs: "Solo para una acción que está pasando ahora mismo.",
    pattern: "estar (estoy, estás, está, estamos, están) + -ando / -iendo" },
  preterito: { when: "A finished action at a specific moment in the past (ayer, anoche, el año pasado).", whenEs: "Una acción terminada en un momento concreto del pasado.",
    pattern: "-ar: -é, -aste, -ó, -amos, -aron · -er/-ir: -í, -iste, -ió, -imos, -ieron" },
  imperfecto: { when: "Background, descriptions and habits in the past: \"used to…\" / \"was …-ing\".", whenEs: "Para describir y para costumbres en el pasado.",
    pattern: "-ar: -aba, -abas, -aba, -ábamos, -aban · -er/-ir: -ía, -ías, -ía, -íamos, -ían" },
  perfecto: { when: "A past action inside a time that isn't over yet (hoy, esta semana, este año) or with ya / alguna vez. In Argentina people often use the pretérito here instead.", whenEs: "Una acción pasada en un período que todavía no terminó.",
    pattern: "haber (he, has, ha, hemos, han) + participle (-ado / -ido)" },
  pluscuamperfecto: { when: "Something that had already happened before another moment in the past.", whenEs: "Algo que ya había pasado antes de otro momento del pasado.",
    pattern: "haber in the past (había, habías, había, habíamos, habían) + participle (-ado / -ido)" },
  ira: { when: "Plans and the near future: \"going to\". The most common way to talk about the future in Latin America.", whenEs: "Planes y futuro cercano.",
    pattern: "ir (voy, vas, va, vamos, van) + a + infinitive" },
  futuro: { when: "Future facts, predictions and promises: \"will\".", whenEs: "Hechos futuros, predicciones y promesas.",
    pattern: "full infinitive + -é, -ás, -á, -emos, -án" },
  condicional: { when: "\"Would\": imagined situations, polite requests and advice (\"yo que tú, iría\").", whenEs: "Situaciones imaginadas, pedidos amables y consejos.",
    pattern: "full infinitive + -ía, -ías, -ía, -íamos, -ían" },
  subjuntivo: { when: "After wanting, feeling, doubting or advising something about someone else: quiero que, ojalá, es importante que.", whenEs: "Después de deseos, emociones, dudas o consejos: quiero que, ojalá…",
    pattern: "yo-form of the present without -o + opposite vowel: -ar → -e, -es…  ·  -er/-ir → -a, -as…" }
};
const PERSON_EN = ["yo (I)", "tú (you)", "él / ella / usted (he / she / you formal)", "nosotros (we)", "ellos / ustedes (they / you all)", "vos (you — Argentina)"];
const tenseLabel = k => (TENSES[k] ? TENSES[k].es : k);

// The form a fully regular verb would have — to tell what is really irregular.
function regularForm(v, t, pi) { const c = Object.assign({}, v); delete c[t]; delete c.fut; return conjugate(c, t)[pi]; }
function irregularNote(v, t, pi, f) {
  if (v.inf === "ser" || v.inf === "ir") return `${f} — ${v.inf} is completely irregular here, worth memorizing`;
  const reg = regularForm(v, t, pi);
  if (reg === f) return null;
  if (f.replace("gu", "g") === reg) return `${f} — spelling change g → gu before e, to keep the hard “g” sound`;
  const sc = /ue/.test(f) && !/ue/.test(reg) ? " (stem change o → ue)" : /ie/.test(f) && !/ie/.test(reg) ? " (stem change e → ie)" : /u/.test(f) && /o/.test(reg) && t !== "presente" ? " (stem change o → u)" : "";
  return `${f} — irregular${sc}; the regular pattern would give “${reg}”`;
}
// How the correct form is built, for this verb, tense and person.
function breakdown(v, t, pi) {
  const forms = allForms(v, t, true), f = forms[pi];
  const aux = (x) => f.split(" ")[0];
  const irr = !!v[t];
  switch (t) {
    case "perfecto": case "pluscuamperfecto":
      return `${aux()} (haber) + ${participle(v)} (participle of ${v.inf}${v.part ? " — irregular" : ""})`;
    case "gerundio":
      return `${aux()} (estar) + ${gerund(v)} (${v.inf} → ${gerund(v)}${v.ger ? " — irregular" : ""})`;
    case "ira":
      return `${aux()} (ir) + a + ${v.inf}`;
    case "futuro": case "condicional": {
      const stem = v.fut || v.inf;
      return `${stem} + -${f.slice(stem.length)}${v.fut ? ` (irregular stem: ${v.inf} → ${stem}-)` : ""}`;
    }
    case "subjuntivo": {
      if (pi === 5) return `vos uses the tú form here: ${f}`;
      if (irr) { const n = irregularNote(v, t, pi, f); if (n) return n; }
      const yo = conjugate(v, "presente")[0];
      const base = yo.endsWith("o") ? yo.slice(0, -1) : vStem(v);
      return `yo-form "${yo}" → ${base}- + -${f.slice(base.length)} (${vClass(v) === "ar" ? "-ar verb takes -e" : "-er/-ir verb takes -a"})`;
    }
    default: {
      if (pi === 5 && t === "presente") return VOS_IRR[v.inf] ? `${f} — irregular vos form` : `vos: ${v.inf} → drop -r, stress the ending → ${f}`;
      if (pi === 5) return `vos uses the tú form here: ${f}`;
      if (irr) { const n = irregularNote(v, t, pi, f); if (n) return n; }
      return `${vStem(v)}- + -${f.slice(vStem(v).length)} (${v.inf} is an -${vClass(v)} verb)`;
    }
  }
}
// What the chosen (wrong) option actually is.
function identifyForm(v, form) {
  const hits = [];
  for (const t of TENSE_ORDER) allForms(v, t, true).forEach((f, i) => { if (f === form) hits.push(`${tenseLabel(t)} · ${PERSON_EN[i].split(" (")[0]}`); });
  return [...new Set(hits)];
}
function explainHTML(q, chosen) {
  const R = TENSE_RULES[q.t], T = TENSES[q.t];
  let wrong = "";
  if (chosen && chosen !== q.ans) {
    const ids = identifyForm(q.v, chosen);
    wrong = `<div class="ex-wrong"><b>You chose “${esc(chosen)}”</b>${ids.length ? ` = ${esc(ids.slice(0, 2).join(" / "))}` : ""}. The sentence needs <b>${esc(tenseLabel(q.t))}</b> for <b>${esc(PERSON_EN[q.pi])}</b>.</div>`;
  }
  return `<div class="cj-explain" dir="ltr">
    ${wrong}
    <div class="ex-h">${esc(T.es)} <span>— ${esc(T.en)}</span></div>
    <div class="ex-row"><b>When:</b> ${esc(R.when)}</div>
    <div class="ex-row es"><b>¿Cuándo?</b> ${esc(R.whenEs)}</div>
    <div class="ex-row"><b>Clue here:</b> “${esc(T.marker)}${T.mid ? " … " + esc(T.mid) : ""}”</div>
    <div class="ex-row"><b>Pattern:</b> <span class="es">${esc(R.pattern)}</span></div>
    <div class="ex-row ex-build"><b>This answer:</b> <span class="es">${esc(breakdown(q.v, q.t, q.pi))}</span></div>
  </div>`;
}
