/* ============ verbs: study + drill ============ */
let VSEL = { tense: "presente", verb: "tener" };
let CJ_SET = null; // selected tenses for drill
function tenseInfo(k) { return TENSES[k] || EXTRA_TENSES[k]; }
function tenseStat(k) { const r = S.conj[k]; return r && r.n ? Math.round(r.c / r.n * 100) : null; }
const useVos = () => S.voseo !== false;
function formsFor(v, k) { return allForms(v, k, useVos()); }
const short = k => ({ preterito: "Pretérito", perfecto: "Perfecto", gerundio: "Estar + -ando", ira: "Ir a + infinitivo", pluscuamperfecto: "Pluscuamperfecto", subjuntivo: "Subjuntivo" }[k] || TENSES[k].es);
function renderVerbs() {
  if (!CJ_SET) CJ_SET = new Set((S.conjSet && S.conjSet.length ? S.conjSet : DEFAULT_CJ).filter(k => TENSES[k]));
  const all = TENSE_ORDER;
  const t = tenseInfo(VSEL.tense);
  const v = VERBS.find(x => x.inf === VSEL.verb) || VERBS[0];
  const forms = formsFor(v, VSEL.tense);
  main().innerHTML = `
  <h2 class="h">זמנים ונטיות</h2>
  <section class="cj-drill">
    <div class="eyebrow">תרגול נטיות — בחר זמנים</div>
    <div class="chips">${TENSE_ORDER.map(k => { const st = tenseStat(k); return `<button class="chip ${CJ_SET.has(k) ? "on" : ""}" data-k="${k}"><span class="es" dir="ltr">${short(k)}</span>${st !== null ? `<small>${st}%</small>` : ""}</button>`; }).join("")}</div>
    <div class="seg two"><button class="${(S.conjVerbs || "all") === "all" ? "on" : ""}" data-vs="all">כל הפעלים</button><button class="${S.conjVerbs === "irr" ? "on" : ""}" data-vs="irr">רק לא־סדירים</button><button class="${S.conjVerbs === "reg" ? "on" : ""}" data-vs="reg">רק סדירים</button></div>
    <button class="vos-tgl" id="vos-tgl"><span class="tgl ${useVos() ? "on" : ""}"><i></i></span><span>🇦🇷 לכלול <b class="es">vos</b> (vos tenés, vos sos) — ארגנטינה ומדג׳ין</span></button>
    <button class="btn primary big" id="cj-start">⏱️ התחל תרגול (15 שאלות)</button>
  </section>
  <h3 class="h3">למידה: איך בונים כל זמן</h3>
  <div class="tabs">${all.map(k => `<button class="tab ${VSEL.tense === k ? "on" : ""}" data-t="${k}"><span class="es" dir="ltr">${short(k)}</span><small>${tenseInfo(k).he}</small></button>`).join("")}</div>
  <section class="tense-card">
    <div class="tc-head"><div><div class="tc-name es" dir="ltr">${t.es}</div><div class="muted small">${t.he} · <span dir="ltr">${esc(t.en)}</span></div></div>${tenseStat(VSEL.tense) !== null ? `<div class="score">${tenseStat(VSEL.tense)}%</div>` : ""}</div>
    <p><b>מתי:</b> ${t.use}</p>
    ${t.form ? `<p><b>איך בונים:</b></p><div class="tc-form es" dir="ltr">${t.form.split(" · ").map(x => `<div>${esc(x)}</div>`).join("")}</div>` : ""}
    ${t.markers ? `<p><b>מילות זמן:</b> <span class="es" dir="ltr">${t.markers}</span></p>` : ""}
    <div class="tc-ex es" dir="ltr">${esc(t.ex)} <button class="icon spk inline" id="tc-ex">🔊</button></div>
  </section>
  <div class="verb-pick">${VERBS.map(x => `<button class="vchip ${x.inf === v.inf ? "on" : ""} ${x.irr ? "irr" : ""}" data-v="${x.inf}">${x.inf}</button>`).join("")}</div>
  <section class="conj-table">
    <div class="ct-head"><span class="es" dir="ltr"><b>${v.inf}</b> · ${esc(v.en)}</span>${v.irr ? `<span class="tag learning">לא סדיר</span>` : `<span class="tag stable">סדיר</span>`}</div>
    ${allPersons(useVos()).map((p, i) => { const f = VSEL.tense === "gerundio" && v.inf === "estar" ? "—" : forms[i]; return `<button class="ct-row ${p.k === 5 ? "vos" : ""}" data-say="${esc(p.es[0] + " " + f)}"><span class="ct-p es" dir="ltr">${p.es.join(" / ")}</span><span class="ct-f es" dir="ltr">${esc(f)}</span><span class="ct-he">${p.he}</span></button>`; }).join("")}
    <div class="muted small">הקש על שורה כדי לשמוע. אין vosotros — כמו בכל אמריקה הלטינית.${useVos() ? " ב־vos רק ההווה שונה (hablás, tenés, sos); בשאר הזמנים משתמשים בצורה של tú." : ""}</div>
  </section>`;
  document.querySelectorAll(".chip").forEach(b => b.onclick = () => { const k = b.dataset.k; CJ_SET.has(k) ? CJ_SET.delete(k) : CJ_SET.add(k); if (!CJ_SET.size) CJ_SET.add(k); S.conjSet = [...CJ_SET]; save(); renderVerbs(); });
  $("#vos-tgl").onclick = () => { S.voseo = !useVos(); save(); renderVerbs(); };
  document.querySelectorAll("[data-vs]").forEach(b => b.onclick = () => { S.conjVerbs = b.dataset.vs; save(); renderVerbs(); });
  document.querySelectorAll(".tab").forEach(b => b.onclick = () => { VSEL.tense = b.dataset.t; renderVerbs(); });
  document.querySelectorAll(".vchip").forEach(b => b.onclick = () => { VSEL.verb = b.dataset.v; renderVerbs(); });
  document.querySelectorAll(".ct-row").forEach(b => b.onclick = () => speak(b.dataset.say, 0.85));
  $("#tc-ex").onclick = () => speak(t.ex, S.settings.rate);
  $("#cj-start").onclick = () => startConj();
}

let CJ = null;
function pickVerbs() {
  const m = S.conjVerbs || "all";
  return VERBS.filter(v => m === "all" || (m === "irr" ? v.irr : !v.irr));
}
function makeQuestion(tenses, verbs) {
  const t = tenses[Math.floor(Math.random() * tenses.length)];
  const vpool = t === "gerundio" ? verbs.filter(x => !x.noGer) : verbs;
  const v = (vpool.length ? vpool : verbs)[Math.floor(Math.random() * (vpool.length || verbs.length))];
  const vos = useVos();
  const persons = allPersons(vos);
  const pi = vos && Math.random() < 0.22 ? 5 : Math.floor(Math.random() * 5);
  const pron = persons[pi].es[Math.floor(Math.random() * persons[pi].es.length)];
  const forms = allForms(v, t, vos);
  const ans = forms[pi];
  const pool = new Set();
  forms.forEach((f, i) => { if (i !== pi) pool.add(f); });
  const others = TENSE_ORDER.filter(x => x !== t).map(x => allForms(v, x, vos)[pi]);
  const distract = shuffle([...pool].filter(f => f !== ans)).slice(0, 2).concat(shuffle(others.filter(f => f !== ans && !pool.has(f))).slice(0, 1));
  while (distract.length < 3) { const f = shuffle(others.concat([...pool]))[0]; if (f !== ans && !distract.includes(f)) distract.push(f); else break; }
  const marker = TENSES[t].marker;
  return { t, v, pi, pron, ans, opts: shuffle([ans, ...distract.slice(0, 3)]), before: `${marker} ${pron}${TENSES[t].mid ? " " + TENSES[t].mid : ""}`, after: v.c };
}
function startConj() {
  const tenses = [...CJ_SET];
  const verbs = pickVerbs();
  const q = []; for (let i = 0; i < 15; i++) q.push(makeQuestion(tenses, verbs));
  CJ = { q, i: 0, c: 0, wrong: 0, tenses };
  go("conj");
}
function renderConj() {
  if (!CJ) return go("verbs");
  if (CJ.i >= CJ.q.length) return renderConjEnd();
  const q = CJ.q[CJ.i];
  const T = TENSES[q.t];
  main().innerHTML = `
  <div class="ses-top"><button class="icon" id="cj-x">✕</button><div class="prog"><div style="width:${Math.round(CJ.i / CJ.q.length * 100)}%"></div></div><span class="muted small">${CJ.i + 1}/${CJ.q.length}</span></div>
  <section class="cjq">
    <div class="cj-meta"><span class="tag new es" dir="ltr">${short(q.t)}</span><span class="muted small">${T.he} · <span dir="ltr">${esc(T.en)}</span></span></div>
    <div class="cj-verb es" dir="ltr">${q.v.inf} <span class="muted small">· ${esc(q.v.en)}</span></div>
    <div class="cj-sent es" dir="ltr">${esc(q.before)} <span class="blank" id="cj-blank">_____</span> ${esc(q.after)}.</div>
    <div class="pt-opts">${q.opts.map(o => `<button class="opt es" dir="ltr" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
    <div id="cj-fb"></div>
  </section>`;
  $("#cj-x").onclick = () => { CJ = null; go("verbs"); };
  let answered = false;
  document.querySelectorAll(".cjq .opt").forEach(b => b.onclick = () => {
    if (answered) return; answered = true;
    const ok = b.dataset.o === q.ans;
    const r = S.conj[q.t] || (S.conj[q.t] = { c: 0, n: 0 }); r.n++; if (ok) r.c++;
    if (ok) CJ.c++; else { CJ.wrong++; CJ.q.splice(Math.min(CJ.q.length, CJ.i + 4), 0, Object.assign({}, q, { opts: shuffle(q.opts) })); }
    bumpStreak(); save();
    document.querySelectorAll(".cjq .opt").forEach(x => { x.disabled = true; if (x.dataset.o === q.ans) x.classList.add("right"); });
    if (!ok) b.classList.add("wrong");
    const full = `${q.before} ${q.ans} ${q.after}.`;
    $("#cj-blank").textContent = q.ans; $("#cj-blank").classList.add(ok ? "ok" : "bad");
    $("#cj-fb").innerHTML = `<div class="cj-fb ${ok ? "ok" : "bad"}"><b>${ok ? "¡Correcto!" : "התשובה: " + esc(q.ans)}</b>
      <div class="muted small">${allPersons(true)[q.pi].he} · ${T.he}</div>
      <div class="cj-row"><button class="pill" id="cj-say">🔊 הקרא</button><button class="pill" id="cj-tab">📋 כל הטבלה</button></div>
      <div id="cj-table"></div>
      <button class="btn primary big" id="cj-next">הבא ←</button></div>`;
    $("#cj-say").onclick = () => speak(full, S.settings.rate);
    $("#cj-tab").onclick = () => { const f = allForms(q.v, q.t, useVos()); $("#cj-table").innerHTML = `<div class="mini-tab">${allPersons(useVos()).map((p, i) => `<div class="${i === q.pi ? "hl" : ""}"><span class="es" dir="ltr">${p.es[0]}</span><b class="es" dir="ltr">${esc(f[i])}</b></div>`).join("")}</div>`; };
    $("#cj-next").onclick = () => { CJ.i++; renderConj(); };
    if (S.settings.autoplay) speak(full, S.settings.rate);
  });
}
function renderConjEnd() {
  const s = CJ;
  const first = s.q.length - s.wrong;
  main().innerHTML = `<section class="done">
    <div class="done-emoji">⏱️</div>
    <h2 dir="ltr">¡Buen trabajo!</h2>
    <p>${s.c} תשובות נכונות מתוך ${s.q.length} שאלות.</p>
    <div class="pt-res">${s.tenses.slice(0, 6).map(k => `<div><span class="es" dir="ltr">${short(k)}</span><b>${tenseStat(k) ?? "—"}%</b></div>`).join("")}</div>
    <button class="btn primary big" id="cj-again">🔁 עוד סבב</button>
    <button class="btn ghost" id="cj-back">חזרה לזמנים</button>
  </section>`;
  $("#cj-again").onclick = () => startConj();
  $("#cj-back").onclick = () => { CJ = null; go("verbs"); };
}
