"use strict";
/* ============ constants ============ */
const MIN = 60e3, HOUR = 36e5, DAY = 864e5;
const LV = {
  1: { es: "Inicial", he: "מתחיל", cefr: "A2", icon: "🌱", desc: "הווה, estar + gerundio, ‏ir a, עבר פשוט. סיפורים קצרים." },
  2: { es: "Intermedio", he: "בינוני", cefr: "B1", icon: "🌿", desc: "+ imperfecto, ‏perfecto, עתיד. סיפורים באורך בינוני." },
  3: { es: "Avanzado", he: "מתקדם", cefr: "B2", icon: "🌳", desc: "+ subjuntivo, ‏condicional, משפטים מורכבים." }
};
const LETTERS = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";
const SPLIT_WORDS = new RegExp("([" + LETTERS + "]+)");
const IS_WORD = new RegExp("^[" + LETTERS + "]+$");
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\([^)]*\)/g, "").replace(/^(el|la|los|las)\s+/, "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const todayStr = (t = Date.now()) => { const d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const endOfDay = (t = Date.now()) => { const d = new Date(t); d.setHours(23, 59, 59, 999); return d.getTime(); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ============ state ============ */
function defaultState() {
  return {
    v: 1, updated: 0, level: 1,
    placement: { done: false },
    cards: {}, known: {}, read: {}, aiGloss: {}, lookups: {},
    settings: { newPerDay: 8, autoplay: true, reverseMature: false, highlight: true, rate: 0.85 },
    day: { date: todayStr(), newDone: 0, revDone: 0 },
    streak: { last: null, count: 0 },
    days: {}, conj: {},
    genIds: []
  };
}
function normalize(s) {
  const d = defaultState();
  if (!s || typeof s !== "object") return d;
  const o = Object.assign(d, s);
  o.settings = Object.assign(defaultState().settings, s.settings || {});
  for (const k of ["cards", "known", "read", "aiGloss", "lookups", "days", "conj"]) if (!o[k] || typeof o[k] !== "object") o[k] = {};
  if (!Array.isArray(o.genIds)) o.genIds = [];
  if (o.streak && o.streak.last && !o.days[o.streak.last]) o.days[o.streak.last] = true;
  return o;
}
let S = defaultState();
let GEN = {}; // generated stories by id
const Store = { db: null, col: null, sample: null, ttsCap: null, status: "local" };

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

let saveTimer = null, writing = false, pendingWrite = false;
function save() {
  S.updated = Date.now();
  lsSet("cyt_state", S);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 1500);
}
async function flush() {
  clearTimeout(saveTimer);
  if (!Store.col) return;
  if (writing) { pendingWrite = true; return; }
  writing = true;
  try { await Store.col.doc("state").set(JSON.parse(JSON.stringify(S))); Store.status = "cloud"; }
  catch (e) { console.warn("save failed", e); Store.status = "local"; }
  writing = false;
  if (pendingWrite) { pendingWrite = false; flush(); }
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });

function rolloverDay() {
  const t = todayStr();
  if (S.day.date !== t) S.day = { date: t, newDone: 0, revDone: 0 };
}
function bumpStreak() { S.days[todayStr()] = true; } // counts distinct practice days only
const practiceDays = () => Object.keys(S.days).length;

/* ============ cloud init ============ */
function withTimeout(p, ms) { return Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]); }
async function initCloud() {
  if (!window.claude || typeof window.claude.use !== "function") return;
  // optional capabilities in parallel
  claude.use("sample").then(s => { Store.sample = s; if (s) rerenderSoft(); }).catch(() => { });
  claude.use("tts").then(t => { Store.ttsCap = t; }).catch(() => { });
  try {
    const [db, user] = await withTimeout(Promise.all([claude.use("db"), claude.use("user")]), 10000) || [];
    if (!db || !user) return;
    const uid = await user.id();
    if (!uid) return;
    Store.db = db;
    Store.col = db.collection("data/users/" + uid);
    const snap = await withTimeout(Store.col.get(), 10000);
    if (!snap) return;
    let remote = null;
    for (const d of snap.docs) {
      if (!d.exists) continue;
      if (d.id === "state") remote = d.data();
      else if (d.id.startsWith("story_")) { const st = d.data(); if (st && st.id) GEN[st.id] = JSON.parse(JSON.stringify(st)); }
    }
    if (remote && (remote.updated || 0) >= (S.updated || 0)) {
      S = normalize(JSON.parse(JSON.stringify(remote)));
      lsSet("cyt_state", S);
    } else if (S.updated) {
      flush(); // local is newer, push it
    }
    // push generated stories that exist only locally
    for (const id of Object.keys(GEN)) if (!snap.docs.some(d => d.id === "story_" + id)) Store.col.doc("story_" + id).set(GEN[id]).catch(() => { });
    lsSet("cyt_gen", GEN);
    Store.status = "cloud";
    buildDefs();
    if (VIEW === "welcome" && S.placement.done) go("home"); else rerenderSoft();
  } catch (e) { console.warn("cloud init", e); }
}

/* ============ stories & card definitions ============ */
function allStories() {
  const gen = Object.values(GEN).sort((a, b) => (a.created || 0) - (b.created || 0));
  return STORIES.concat(gen);
}
function storyById(id) { return STORIES.find(s => s.id === id) || GEN[id]; }
function splitSentences(text) {
  const m = text.match(/[^.!?…]+[.!?…]+[»"”]?\s*|[^.!?…]+$/g);
  return (m || [text]).map(s => s.trim()).filter(Boolean);
}
function tokensLower(text) { return text.split(SPLIT_WORDS).filter(t => IS_WORD.test(t)).map(t => t.toLowerCase()); }

for (const k in GLOSS2) if (!(k in GLOSS)) GLOSS[k] = GLOSS2[k];
let DEFS = {}, STORY_FORM = {}, GLOBAL_FORM = {}, JERGA_IDS = [];
// fragments of multi-word expressions — never map them globally
const AMBIG = new Set(["una", "más", "pena", "orden", "ojo", "cuenta", "dio", "menos", "pesar", "hondo", "medida", "sobra", "embargo", "acuerdo", "bajo", "baja", "onda", "re", "mango", "mono", "mona"]);
function buildDefs() {
  DEFS = {}; STORY_FORM = {}; GLOBAL_FORM = {};
  for (const st of allStories()) {
    STORY_FORM[st.id] = {};
    const sents = [];
    st.paragraphs.forEach((p, pi) => splitSentences(p.es).forEach(s => sents.push({ s, pi })));
    for (const t of st.targets || []) {
      const id = "c_" + slug(t.es);
      const match = (t.match || []).map(x => String(x).toLowerCase());
      let found = sents.find(x => tokensLower(x.s).some(w => match.includes(w)));
      if (!DEFS[id]) DEFS[id] = { id, es: t.es, en: t.en, storyId: st.id, level: st.level, sentence: found ? found.s : "", pi: found ? found.pi : 0, match, region: st.region || null };
      for (const f of match) { STORY_FORM[st.id][f] = id; if (!GLOBAL_FORM[f] && !AMBIG.has(f)) GLOBAL_FORM[f] = id; }
    }
  }
  JERGA_IDS = [];
  for (const j of JERGA) {
    const id = "c_" + slug(j.es.split(" / ")[0]);
    const match = (j.match || tokensLower(j.es)).map(x => x.toLowerCase());
    if (!DEFS[id]) DEFS[id] = { id, es: j.es, en: j.en, storyId: null, level: 1, sentence: j.ex, sentEn: j.exEn, slang: true, region: j.region, match };
    else { DEFS[id].region = DEFS[id].region || j.region; DEFS[id].ex2 = j.ex; DEFS[id].ex2En = j.exEn; }
    JERGA_IDS.push(id);
    for (const f of match) if (!GLOBAL_FORM[f] && !AMBIG.has(f)) GLOBAL_FORM[f] = id;
  }
}
function getDef(id) { return DEFS[id] || (S.cards[id] && S.cards[id].def) || null; }
function cardStatus(id) {
  if (S.known[id]) return "known";
  const c = S.cards[id];
  if (!c || c.st === "new") return "new";
  if (c.st === "learning" || (c.s || 0) < 7) return "learning";
  return "stable";
}
function isNewCard(id) { return !S.known[id] && (!S.cards[id] || S.cards[id].st === "new"); }
function nextStory() {
  const lst = allStories().filter(s => s.level === S.level && !S.read[s.id]);
  if (lst.length) return lst[0];
  return allStories().find(s => !S.read[s.id] && s.level <= S.level) || null;
}
function newQueue(limitStoryId) {
  const out = [], seen = new Set();
  const push = id => { if (id && !seen.has(id) && getDef(id) && isNewCard(id)) { seen.add(id); out.push(id); } };
  if (limitStoryId) { Object.values(STORY_FORM[limitStoryId] || {}).forEach(push); return out; }
  // 1. words the user added from stories
  Object.keys(S.cards).filter(id => S.cards[id].st === "new").sort((a, b) => (S.cards[a].added || 0) - (S.cards[b].added || 0)).forEach(push);
  // 2+3. words from stories already read, then the next story — interleaved with slang (2:1)
  const storyIds = [];
  for (const st of allStories()) if (S.read[st.id]) storyIds.push(...Object.values(STORY_FORM[st.id]));
  const nx = nextStory(); if (nx) storyIds.push(...Object.values(STORY_FORM[nx.id]));
  const sl = JERGA_IDS.filter(isNewCard);
  let a = 0, b = 0;
  const su = [...new Set(storyIds)].filter(id => !seen.has(id) && isNewCard(id));
  while (a < su.length || b < sl.length) { if (a < su.length) push(su[a++]); if (a < su.length) push(su[a++]); if (b < sl.length) push(sl[b++]); }
  // 4. everything else at or below level
  for (const st of allStories()) if (st.level <= S.level) Object.values(STORY_FORM[st.id]).forEach(push);
  return out;
}
function dueList(storyId) {
  const now = Date.now(), eod = endOfDay(now);
  return Object.keys(S.cards).filter(id => {
    const c = S.cards[id];
    if (!c || c.st === "new" || S.known[id] || !getDef(id)) return false;
    if (storyId && getDef(id).storyId !== storyId) return false;
    return c.st === "learning" ? c.due <= now + 20 * MIN : c.due <= eod;
  }).sort((a, b) => S.cards[a].due - S.cards[b].due);
}
function newRemaining() { rolloverDay(); return Math.max(0, S.settings.newPerDay - S.day.newDone); }

/* ============ FSRS-4.5 ============ */
const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
const FCT = 19 / 81, DECAY = -0.5;
const clampD = d => Math.min(10, Math.max(1, d));
const retr = (t, s) => Math.pow(1 + FCT * t / s, DECAY);
const initD = g => clampD(W[4] - W[5] * (g - 3));
const nextD = (d, g) => clampD(W[7] * initD(3) + (1 - W[7]) * (d - W[6] * (g - 3)));
const sRecall = (d, s, r, g) => s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1) + 1);
const sForget = (d, s, r) => Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
function schedule(c, g, now = Date.now()) {
  const fresh = !c || c.st === "new" || !c.s;
  const n = Object.assign({ reps: 0, lapses: 0 }, c || {});
  if (fresh) { n.s = W[g - 1]; n.d = initD(g); }
  else {
    const t = Math.max(0, (now - (c.last || now)) / DAY);
    const r = retr(t, c.s);
    n.d = nextD(c.d, g);
    n.s = g === 1 ? sForget(c.d, c.s, r) : sRecall(c.d, c.s, r, g);
  }
  n.reps = (n.reps || 0) + 1;
  if (g === 1 && !fresh) n.lapses = (n.lapses || 0) + 1;
  n.last = now;
  if (g === 1) { n.st = "learning"; n.due = now + 10 * MIN; n.ivl = 0; }
  else {
    let ivl = Math.max(1, Math.round(n.s));
    if (g === 2) ivl = Math.max(1, Math.min(ivl, fresh ? 1 : ivl));
    if (g === 4) ivl = Math.max(ivl, fresh ? 4 : ivl);
    ivl = Math.min(365, ivl);
    n.st = "review"; n.ivl = ivl; n.due = now + ivl * DAY - 3 * HOUR;
  }
  return n;
}
function fmtIvl(c) {
  if (c.st === "learning") return "10 דק׳";
  const d = c.ivl;
  if (d < 30) return d + " י׳";
  if (d < 365) return Math.round(d / 30) + " ח׳";
  return "שנה";
}

/* ============ speech ============ */
const TTS = { voice: null, synth: "speechSynthesis" in window ? window.speechSynthesis : null, run: 0 };
function pickVoice() {
  if (!TTS.synth) return;
  const vs = TTS.synth.getVoices().filter(v => /^es([-_]|$)/i.test(v.lang));
  const pref = ["es-AR", "es-CO", "es-US", "es-419", "es-MX", "es-CL", "es-PE", "es-ES"];
  let best = null;
  for (const p of pref) { best = vs.find(v => v.lang.replace("_", "-").toLowerCase() === p.toLowerCase()); if (best) break; }
  TTS.voice = best || vs[0] || null;
}
if (TTS.synth) { pickVoice(); TTS.synth.onvoiceschanged = pickVoice; }
function voiceLabel() {
  if (TTS.voice) return TTS.voice.name + " (" + TTS.voice.lang + ")";
  if (Store.ttsCap) return "קול Claude";
  if (TTS.synth) return "קול ברירת המחדל של המכשיר";
  return "אין הקראה זמינה";
}
function clean(text) { return text.replace(/[—«»]/g, " ").replace(/\s+/g, " ").trim(); }
function speak(text, rate) {
  rate = rate || 1;
  text = clean(text);
  if (TTS.synth && (TTS.voice || !Store.ttsCap)) {
    return new Promise(res => {
      try {
        TTS.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        if (TTS.voice) { u.voice = TTS.voice; u.lang = TTS.voice.lang; } else u.lang = "es-MX";
        u.rate = rate;
        let done = false; const fin = () => { if (!done) { done = true; res(); } };
        u.onend = fin; u.onerror = fin;
        TTS.synth.speak(u);
        setTimeout(fin, 3000 + text.length * 180 / rate); // safety on buggy engines
      } catch (e) { res(); }
    });
  }
  if (Store.ttsCap) return Store.ttsCap.speak(text, { language: "es", rate: Math.min(1.5, Math.max(0.7, rate)) }).catch(() => { });
  toast("לא נמצא קול ספרדי במכשיר");
  return Promise.resolve();
}
function stopSpeak() {
  TTS.run++;
  try { TTS.synth && TTS.synth.cancel(); } catch (e) { }
  try { Store.ttsCap && Store.ttsCap.stop && Store.ttsCap.stop(); } catch (e) { }
}

/* ============ gloss lookup ============ */
function lookup(word, story) {
  const w = word.toLowerCase();
  const raw = (story && story.gloss && story.gloss[w]) || GLOSS[w] || S.aiGloss[w] || null;
  if (!raw) return null;
  const [gloss, lemma] = String(raw).split("|").map(x => x && x.trim());
  return { gloss, lemma: lemma || null };
}

/* ============ AI (sample) ============ */
async function askJSON(prompt, tier) {
  const s = Store.sample;
  if (!s) throw new Error("no sample");
  if (typeof s.json === "function") {
    try { const v = await s.json(prompt, { modelTier: tier || "default" }); if (v && typeof v === "object") return v; } catch (e) { if (e && (e.code === "not_granted" || e.code === "rate_limited")) throw e; }
  }
  const r = await s(prompt, { modelTier: tier || "default" });
  const t = (r && r.text) || "";
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a < 0 || b < a) throw new Error("bad json");
  return JSON.parse(t.slice(a, b + 1));
}

/* ============ UI shell ============ */
let VIEW = "home";
const main = () => $("#main");
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 2200);
}
function setNav(v) {
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
}
function go(v, arg) {
  stopSpeak(); closeSheet();
  if (VIEW === "reader") Reader.stop();
  VIEW = v; setNav(v === "reader" ? "stories" : v === "session" ? "cards" : v === "conj" ? "verbs" : v);
  $("#hdr-level").textContent = LV[S.level].icon + " " + LV[S.level].es;
  document.body.classList.toggle("immersive", v === "session" || v === "placement" || v === "conj");
  const m = main(); m.scrollTop = 0; window.scrollTo(0, 0);
  ({ home: renderHome, cards: renderCards, stories: renderStories, progress: renderProgress, reader: renderReader, session: renderSession, placement: renderPlacement, welcome: renderWelcome, verbs: renderVerbs, conj: renderConj })[v](arg);
}
function rerenderSoft() { if (["home", "cards", "stories", "progress", "verbs"].includes(VIEW)) go(VIEW); }

/* ============ welcome ============ */
function renderWelcome() {
  main().innerHTML = `
  <section class="hero">
    <div class="hero-badge" dir="ltr">¡Hola${S.name ? ", " + esc(S.name) : ""}!</div>
    <h1>Cuentos y Tarjetas</h1>
    <p>סיפורים קצרים בספרדית שבונים אוצר מילים, וכרטיסיות שדואגות שהמילים יישארו.</p>
    <ul class="how">
      <li><b>📖 קוראים</b> סיפור ברמה שלך, מקישים על מילה ורואים תרגום.</li>
      <li><b>🃏 מתרגלים</b> את המילים מהסיפור בכרטיסיות חכמות (FSRS).</li>
      <li><b>🔁 פוגשים אותן שוב</b> בסיפורים הבאים, וכך הן נקלטות.</li>
    </ul>
    <label class="muted small" for="w-name">איך קוראים לך? (לא חובה)</label>
    <input class="name-in" id="w-name" maxlength="30" autocomplete="given-name" value="${esc(S.name || "")}">
    <button class="btn primary big" id="w-test">מבחן רמה קצר (3–4 דק׳)</button>
    <button class="btn ghost" id="w-skip">דלג — התחל ברמת Inicial</button>
  </section>`;
  const keepName = () => { const n = ($("#w-name").value || "").trim(); if (n) { S.name = n; save(); } };
  $("#w-test").onclick = () => { keepName(); go("placement"); };
  $("#w-skip").onclick = () => { keepName(); S.placement = { done: true, skipped: true, date: Date.now() }; S.level = 1; save(); go("home"); };
}

/* ============ home ============ */
function levelReady() {
  if (S.level >= 3) return false;
  const ids = Object.values(DEFS).filter(d => d.level === S.level).map(d => d.id);
  if (!ids.length) return false;
  const stable = ids.filter(id => S.known[id] || (S.cards[id] && S.cards[id].st === "review" && S.cards[id].s >= 7)).length;
  const reads = allStories().filter(s => s.level === S.level && S.read[s.id]);
  if (!reads.length) return false;
  const avg = reads.reduce((a, s) => a + S.read[s.id].score, 0) / reads.length;
  return stable / ids.length >= 0.7 && avg >= 0.8;
}
function renderHome() {
  rolloverDay();
  const due = dueList().length, nw = Math.min(newRemaining(), newQueue().length);
  const nx = nextStory();
  const name = LV[S.level];
  main().innerHTML = `
  <section class="today">
    <div class="today-top">
      <div><div class="eyebrow">היום${S.days[todayStr()] ? " · תרגלת ✓" : ""}</div><div class="today-title">${due + nw ? "יש לך עבודה מתוקה" : "הכול נקי להיום ✨"}</div></div>
      <div class="streak" title="ימי תרגול">📅 ${practiceDays()} <small>ימי תרגול</small></div>
    </div>
    <div class="stats3">
      <div><b>${due}</b><span>לחזרה</span></div>
      <div><b>${nw}</b><span>מילים חדשות</span></div>
      <div><b>${S.day.revDone}</b><span>תרגלת היום</span></div>
    </div>
    <button class="btn primary big" id="h-practice">🃏 ${due + nw ? "תרגול כרטיסיות" : "להמשיך לתרגל"}</button>
    <button class="btn ghost" id="h-verbs">⏱️ תרגול זמנים ונטיות</button>
  </section>
  ${levelReady() ? `<section class="banner"><b>נראה שאתה מוכן לעלות רמה 🎉</b><p>שלטת ברוב המילים של ${name.es} והבנת את הסיפורים היטב.</p><button class="btn primary" id="h-up">עבור ל־${LV[S.level + 1].es}</button></section>` : ""}
  ${nx ? `<section class="next-story" id="h-story">
    <div class="eyebrow">הסיפור הבא שלך</div>
    <div class="ns-row"><div><div class="ns-title es" dir="ltr">${esc(nx.title)}</div><div class="muted">${esc(nx.titleEn)} · ${LV[nx.level].icon} ${LV[nx.level].es}</div></div><div class="ns-go">📖</div></div>
    <div class="muted small">${(nx.targets || []).length} מילים חדשות מחכות בפנים</div>
  </section>` : `<section class="next-story"><div class="eyebrow">סיימת את כל הסיפורים ברמה</div><p>צור סיפור חדש עם Claude במסך הסיפורים.</p></section>`}
  ${installCard()}
  <section class="tip"><b>טיפ:</b> קרא את הסיפור קודם, ורק אחר כך תרגל את המילים שלו — מפגש בהקשר ואז שליפה מהזיכרון זה השילוב שהכי מחזיק.</section>`;
  if ($("#h-install")) $("#h-install").onclick = async () => { if (!INSTALL.prompt) return; INSTALL.prompt.prompt(); try { await INSTALL.prompt.userChoice; } catch (e) { } INSTALL.prompt = null; renderHome(); };
  if ($("#h-install-x")) $("#h-install-x").onclick = () => { S.installHidden = true; save(); renderHome(); };
  $("#h-practice").onclick = () => due + nw ? go("cards") : startSession("extra");
  $("#h-verbs").onclick = () => go("verbs");
  if ($("#h-story")) $("#h-story").onclick = () => go("reader", nx.id);
  if ($("#h-up")) $("#h-up").onclick = () => { S.level++; save(); toast("עברת ל־" + LV[S.level].es); go("home"); };
}

/* ============ cards hub ============ */
let MODE = "mixed";
function renderCards() {
  rolloverDay();
  const due = dueList().length, nq = newQueue().length, nr = newRemaining();
  const counts = { new: 0, learning: 0, stable: 0, known: 0 };
  for (const id of Object.keys(DEFS).concat(Object.keys(S.cards).filter(i => !DEFS[i]))) counts[cardStatus(id)]++;
  main().innerHTML = `
  <h2 class="h">כרטיסיות</h2>
  <section class="modes">
    ${[["mixed", "🔀", "חדשות + ישנות", "מעורב, כמו באנקי"], ["review", "🔁", "רק ישנות", "חזרות שהגיע זמנן, ואם אין, חזרה חופשית"], ["new", "✨", "רק חדשות", "10 מילים חדשות בכל סבב, בלי הגבלה"], ["free", "🧠", "חזרה חופשית", "כל מה שלמדת, החלשות קודם, כמה שבא לך"], ["jerga", "🌎", "סלנג לטיני", "🇦🇷 ארגנטינה · 🇨🇴 קולומביה · ביטויים של אמריקה הלטינית"]].map(([k, ic, t, d]) => `
      <button class="mode ${MODE === k ? "on" : ""}" data-m="${k}"><span class="mi">${ic}</span><span><b>${t}</b><small>${d}</small></span></button>`).join("")}
  </section>
  <section class="card-sum">
    <div><b>${due}</b><span>לחזרה עכשיו</span></div>
    <div><b>${S.day.newDone}/${S.settings.newPerDay}</b><span>יעד מילים חדשות היום</span></div>
  </section>
  <button class="btn primary big" id="c-start">התחל תרגול</button>

  <h3 class="h3">המילים שלך</h3>
  <div class="bars">
    ${bar("ידועות", counts.known, "known")}${bar("יציבות (7+ ימים)", counts.stable, "stable")}${bar("בלמידה", counts.learning, "learning")}${bar("חדשות", counts.new, "new")}
  </div>
  <button class="btn ghost" id="c-list">הצג את כל המילים</button>
  <div id="wordlist"></div>`;
  document.querySelectorAll(".mode").forEach(b => b.onclick = () => { MODE = b.dataset.m; renderCards(); });
  $("#c-start").onclick = () => startSession(MODE);
  $("#c-list").onclick = () => {
    const ids = Object.keys(DEFS).concat(Object.keys(S.cards).filter(i => !DEFS[i]));
    const lab = { new: "חדשה", learning: "בלמידה", stable: "יציבה", known: "ידועה" };
    $("#wordlist").innerHTML = `<div class="wl">${ids.map(id => { const d = getDef(id); const st = cardStatus(id); return `<div class="wl-row"><span class="es" dir="ltr">${d.region && REGIONS[d.region] ? REGIONS[d.region].flag + " " : ""}${esc(d.es)}</span><span class="muted" dir="ltr">${esc(d.en)}</span><span class="tag ${st}">${lab[st]}</span></div>`; }).join("")}</div>`;
    $("#c-list").remove();
  };
}
function bar(label, n, cls) {
  const total = Math.max(1, Object.keys(DEFS).length + Object.keys(S.cards).filter(i => !DEFS[i]).length);
  return `<div class="bar"><span>${label}</span><div class="track"><div class="fill ${cls}" style="width:${Math.round(n / total * 100)}%"></div></div><b>${n}</b></div>`;
}

/* ============ session ============ */
let SES = null;
function startSession(mode, storyId) {
  rolloverDay();
  const due = dueList(storyId);
  let news = newQueue(storyId);
  const learned = () => Object.keys(S.cards).filter(id => S.cards[id].st !== "new" && !S.known[id] && getDef(id))
    .sort((a, b) => weakness(b) - weakness(a)).slice(0, 25);
  if (!storyId) {
    if (mode === "new") news = news.slice(0, 10);
    else if (mode === "extra") news = news.slice(0, 5);
    else news = news.slice(0, newRemaining() || (due.length ? 0 : 5));
  }
  let q = [];
  if (storyId) q = due.concat(news);
  else if (mode === "review") q = due.length ? due : learned();
  else if (mode === "new") q = news;
  else if (mode === "free") q = learned();
  else if (mode === "jerga") { const js = new Set(JERGA_IDS); q = dueList().filter(id => js.has(id)).concat(JERGA_IDS.filter(isNewCard).slice(0, 10)); if (!q.length) q = learned().filter(id => js.has(id)); }
  else if (mode === "extra") { q = due.concat(news); if (q.length < 10) q = q.concat(learned().filter(id => !q.includes(id))).slice(0, Math.max(q.length, 20)); }
  else { // interleave: one new after every 3 reviews
    let i = 0, j = 0;
    while (i < due.length || j < news.length) {
      for (let k = 0; k < 3 && i < due.length; k++) q.push(due[i++]);
      if (j < news.length) q.push(news[j++]);
    }
  }
  if (!q.length && mode !== "free" && mode !== "jerga") { q = learned(); if (!q.length) q = newQueue().slice(0, 10); }
  if (!q.length) { toast("עוד אין כרטיסיות — קרא סיפור כדי להתחיל"); return; }
  SES = { q: q.slice(0, 120), i: 0, flipped: false, done: 0, again: 0, total: Math.min(q.length, 120), reverse: false, storyId, mode };
  go("session");
}
function renderSession() {
  if (!SES) return go("cards");
  if (SES.i >= SES.q.length) return renderSessionEnd();
  const id = SES.q[SES.i], d = getDef(id), c = S.cards[id];
  const fresh = isNewCard(id);
  SES.reverse = !fresh && S.settings.reverseMature && c && c.s >= 21 && Math.random() < 0.35;
  SES.flipped = false;
  const st = storyById(d.storyId);
  const ctx = cardContext(d, st);
  const forms = d.match || [String(d.es).toLowerCase()];
  const sentHtml = ctx.es ? tappable(ctx.es, forms) : "";
  main().innerHTML = `
  <div class="ses-top">
    <button class="icon" id="s-x" aria-label="סגור">✕</button>
    <div class="prog"><div style="width:${Math.round(SES.i / SES.q.length * 100)}%"></div></div>
    <span class="muted small">${SES.i + 1}/${SES.q.length}</span>
  </div>
  <div class="flash ${fresh ? "is-new" : ""}" id="flash">
    ${fresh ? `<div class="newtag">מילה חדשה</div>` : ""}
    ${d.region && REGIONS[d.region] ? `<div class="regtag">${REGIONS[d.region].flag} ${REGIONS[d.region].he}</div>` : ""}
    <div class="front">
      ${SES.reverse ? `<div class="f-word en" dir="ltr">${esc(d.en)}</div><div class="muted small">איך אומרים בספרדית?</div>`
      : `<div class="f-word es" dir="ltr">${esc(d.es)}</div><button class="icon spk" id="s-say" aria-label="הקרא">🔊</button>`}
    </div>
    <div class="back" hidden>
      <div class="divider"></div>
      ${SES.reverse ? `<div class="b-word es" dir="ltr">${esc(d.es)} <button class="icon spk inline" id="s-say2">🔊</button></div>` : `<div class="b-word en" dir="ltr">${esc(d.en)}</div>`}
      ${sentHtml ? `<div class="ctx-wrap"><div class="ctx es" dir="ltr" id="ctx-es">${sentHtml}</div><div class="ctx en-ctx" dir="ltr" id="ctx-en" hidden>${esc(ctx.en)}</div>
        <div class="ctx-tools">${ctx.en ? `<button class="pill" id="s-lang">🔄 English</button>` : ""}<button class="pill" id="s-sent">🔊 הקרא</button><span class="muted small">הקש על מילה לתרגום</span></div></div>` : ""}
      ${d.ex2 ? `<div class="ex2 es" dir="ltr">${esc(d.ex2)}<div class="muted small">${esc(d.ex2En)}</div></div>` : ""}
      ${st ? `<div class="muted small">מתוך: <span class="es" dir="ltr">${esc(st.title)}</span></div>` : d.slang ? `<div class="muted small">מחפיסת הסלנג 🌎</div>` : ""}
    </div>
  </div>
  <div class="ses-actions" id="acts">
    <button class="btn primary big" id="s-flip">הצג תשובה</button>
    ${fresh ? `<button class="btn ghost" id="s-known">כבר מכיר את המילה — דלג</button>` : ""}
  </div>`;
  $("#s-x").onclick = () => { SES = null; go("cards"); };
  const sayWord = () => speak(d.es.replace(/\(.*?\)/g, ""), 0.9);
  if ($("#s-say")) $("#s-say").onclick = e => { e.stopPropagation(); sayWord(); };
  if (!SES.reverse && S.settings.autoplay) setTimeout(sayWord, 150);
  $("#s-flip").onclick = flip;
  $("#flash").onclick = () => { if (!SES.flipped) flip(); };
  if ($("#s-known")) $("#s-known").onclick = () => { S.known[id] = true; delete S.cards[id]; save(); SES.i++; renderSession(); };
  function flip() {
    SES.flipped = true;
    $(".back").hidden = false;
    if ($("#s-say2")) $("#s-say2").onclick = e => { e.stopPropagation(); sayWord(); };
    if ($("#s-sent")) $("#s-sent").onclick = e => { e.stopPropagation(); speak(ctx.es, S.settings.rate); };
    if ($("#s-lang")) $("#s-lang").onclick = e => { e.stopPropagation(); const en = $("#ctx-en"), sp = $("#ctx-es"); const toEn = en.hidden; en.hidden = !toEn; sp.hidden = toEn; e.target.textContent = toEn ? "🔄 Español" : "🔄 English"; };
    if ($("#ctx-es")) $("#ctx-es").onclick = e => { e.stopPropagation(); const w = e.target.closest(".w"); if (!w) return; document.querySelectorAll(".w.sel").forEach(x => x.classList.remove("sel")); w.classList.add("sel"); openWordSheet(w.dataset.w, st || { id: "_", paragraphs: [], gloss: {} }, ctx.es, -1, "card"); };
    if (SES.reverse && S.settings.autoplay) sayWord();
    const now = Date.now();
    const opts = [[1, "Otra vez", "שוב"], [2, "Difícil", "קשה"], [3, "Bien", "טוב"], [4, "Fácil", "קל"]];
    $("#acts").innerHTML = `<div class="grades">${opts.map(([g, es, he]) => `<button class="grade g${g}" data-g="${g}"><b class="es">${es}</b><small>${he} · ${fmtIvl(schedule(c && c.st !== "new" ? c : null, g, now))}</small></button>`).join("")}</div>`;
    document.querySelectorAll(".grade").forEach(b => b.onclick = () => grade(+b.dataset.g));
  }
  function grade(g) {
    const before = S.cards[id];
    const wasNew = isNewCard(id);
    const def = before && before.def;
    const n = schedule(before && before.st !== "new" ? before : null, g);
    if (def) n.def = def;
    if (before && before.added) n.added = before.added;
    S.cards[id] = n;
    rolloverDay();
    if (wasNew) S.day.newDone++;
    S.day.revDone++; SES.done++;
    bumpStreak();
    if (g === 1) { SES.again++; SES.q.splice(Math.min(SES.q.length, SES.i + 4), 0, id); }
    save();
    SES.i++; renderSession();
  }
}
function weakness(id) {
  const c = S.cards[id]; if (!c || !c.s) return 1;
  const t = Math.max(0, (Date.now() - (c.last || Date.now())) / DAY);
  return 1 - retr(t, c.s) + (c.lapses || 0) * 0.05 + (c.st === "learning" ? 0.5 : 0);
}
function splitEn(t) { return (t.match(/[^.!?]+[.!?]+["”]?\s*|[^.!?]+$/g) || [t]).map(s => s.trim()).filter(Boolean); }
function cardContext(d, st) {
  if (d.slang) return { es: d.sentence || "", en: d.sentEn || "" };
  if (!st || !st.paragraphs || !st.paragraphs[d.pi || 0]) return { es: d.sentence || "", en: "" };
  const p = st.paragraphs[d.pi || 0];
  const es = splitSentences(p.es), en = splitEn(p.en);
  let i = es.findIndex(x => x === d.sentence);
  if (i < 0) return { es: d.sentence || es[0], en: d.sentence ? "" : en[0] || "" };
  const j = i + 1 < es.length ? i + 1 : Math.max(0, i - 1);
  const a = Math.min(i, j), b = Math.max(i, j);
  const esTxt = (a === b ? [es[i]] : [es[a], es[b]]).join(" ");
  const enTxt = es.length === en.length ? (a === b ? [en[i]] : [en[a], en[b]]).join(" ") : p.en;
  return { es: esTxt, en: enTxt };
}
function tappable(text, forms) {
  return text.split(SPLIT_WORDS).map(t => IS_WORD.test(t) ? `<span class="w${forms.includes(t.toLowerCase()) ? " hit" : ""}" data-w="${esc(t)}">${esc(t)}</span>` : esc(t)).join("");
}
function highlightIn(sentence, forms) {
  return sentence.split(SPLIT_WORDS).map(t => IS_WORD.test(t) && forms.includes(t.toLowerCase()) ? `<mark>${esc(t)}</mark>` : esc(t)).join("");
}
function renderSessionEnd() {
  const s = SES; SES = null;
  flush();
  main().innerHTML = `<section class="done">
    <div class="done-emoji">🎉</div>
    <h2 dir="ltr">¡Muy bien!</h2>
    <p>תרגלת ${s.done} כרטיסיות${s.again ? `, ${s.again} חזרו לסבב נוסף` : ""}.</p>
    <button class="btn primary big" id="d-more">🔁 להמשיך לתרגל</button>
    <button class="btn ghost" id="d-new">✨ עוד 10 מילים חדשות</button>
    <button class="btn ghost" id="d-home">חזרה לבית</button>
    ${nextStory() ? `<button class="btn ghost" id="d-story">📖 לסיפור הבא</button>` : ""}
  </section>`;
  $("#d-home").onclick = () => go("home");
  $("#d-more").onclick = () => startSession("extra");
  $("#d-new").onclick = () => startSession("new");
  if ($("#d-story")) $("#d-story").onclick = () => go("reader", nextStory().id);
}

/* ============ stories library ============ */
function renderStories() {
  const byLevel = { 1: [], 2: [], 3: [] };
  allStories().forEach(s => (byLevel[s.level] || byLevel[1]).push(s));
  main().innerHTML = `
  <h2 class="h">סיפורים</h2>
  <section class="gen">
    <div class="gen-head"><b>✨ סיפור חדש בשבילך</b><span class="muted small">Claude כותב סיפור ברמה ${LV[S.level].es} שמשלב מילים שאתה לומד עכשיו</span></div>
    ${Store.sample ? `<div class="gen-row"><input id="g-topic" placeholder="נושא (לא חובה): פרו, עבודה, כדורגל…" maxlength="80"><button class="btn primary" id="g-go">צור</button></div><div id="g-status" class="muted small"></div>`
      : `<div class="muted small">זמין כשהאפליקציה פתוחה דרך Claude (בממשק המלא).</div>`}
  </section>
  ${[S.level, ...[1, 2, 3].filter(l => l !== S.level)].map(l => `
    <h3 class="h3">${LV[l].icon} ${LV[l].es} <span class="muted small">· ${LV[l].he} · ${LV[l].cefr}</span></h3>
    <div class="slist">${byLevel[l].map(s => storyRow(s)).join("") || `<div class="muted small">אין עדיין סיפורים</div>`}</div>`).join("")}`;
  document.querySelectorAll(".srow").forEach(b => b.onclick = () => go("reader", b.dataset.id));
  if ($("#g-go")) $("#g-go").onclick = generateStory;
}
function storyRow(s) {
  const r = S.read[s.id];
  const ids = [...new Set(Object.values(STORY_FORM[s.id] || {}))];
  const learnt = ids.filter(id => ["stable", "known"].includes(cardStatus(id))).length;
  return `<button class="srow ${r ? "read" : ""}" data-id="${s.id}">
    <div class="sr-main"><div class="sr-title es" dir="ltr">${s.region && REGIONS[s.region] ? REGIONS[s.region].flag + " " : ""}${esc(s.title)}${s.generated ? ' <span class="ai">AI</span>' : ""}</div><div class="muted small" dir="ltr">${esc(s.titleEn || "")}</div></div>
    <div class="sr-side">${r ? `<span class="score">✓ ${Math.round(r.score * 100)}%</span>` : `<span class="muted small">${ids.length} מילים</span>`}<span class="muted small">${learnt}/${ids.length} נקלטו</span></div>
  </button>`;
}
async function generateStory() {
  const btn = $("#g-go"), status = $("#g-status");
  const topic = ($("#g-topic").value || "").trim();
  const learning = Object.keys(S.cards).filter(id => ["learning"].includes(cardStatus(id)) || (S.cards[id].st === "review" && S.cards[id].s < 21)).map(getDef).filter(Boolean);
  const pick = shuffle(learning).slice(0, 8).map(d => d.es);
  const avoid = Object.values(DEFS).map(d => d.es).slice(0, 120);
  const spec = { 1: "CEFR A2: present tense, estar+gerund, ir a + infinitive, simple preterite. Short sentences. 140-170 words.", 2: "CEFR B1: add imperfect, present perfect, future, commands. 180-230 words.", 3: "CEFR B2: add subjunctive, conditional, complex sentences. 230-290 words." }[S.level];
  const prompt = `You write a graded reading story for a Spanish learner (Hebrew native speaker who reads English glosses). Use natural, colloquial Latin American Spanish, preferably set in Argentina (with voseo: vos sos, tenés, querés) or Colombia, and include 1-2 common local slang words (e.g. che, re, copado, laburo, bondi, parce, bacano, chévere, ¡de una!), glossed like any other word.
Level: ${spec} Exactly 4 paragraphs. About 97% of the words must be easy for this level.
${pick.length ? `The learner is currently studying these words. Use EACH of them naturally at least once (any inflection): ${pick.join(", ")}.` : ""}
Introduce exactly 6 NEW useful words for this level and repeat each one at least twice in the story. Do not choose any of these as new words: ${avoid.join(", ")}.
Topic: ${topic || "everyday life or travel in Latin America, with a small surprise or problem that gets solved"}.
Return ONLY a JSON object, no markdown:
{"title":"Spanish title","titleEn":"English title","paragraphs":[{"es":"paragraph","en":"natural English translation"}],"targets":[{"es":"dictionary form (nouns with el/la)","en":"short English meaning","match":["each exact lowercase form of this word as it appears in the paragraphs"]}],"gloss":{"<every distinct lowercase word in the paragraphs AND questions>":"short English meaning in context; for conjugated verbs add ' | infinitive'"},"questions":[{"q":"comprehension question in Spanish","options":["a","b","c"],"answer":0}]}
targets must contain only the 6 new words. Write 3 questions. The gloss object must cover every single word form, including articles, names and small words.`;
  btn.disabled = true; status.textContent = "Claude כותב לך סיפור… (בערך דקה)";
  try {
    const j = await askJSON(prompt, "default");
    if (!j || !Array.isArray(j.paragraphs) || !j.paragraphs.length) throw new Error("empty");
    const id = "g" + Date.now();
    const gloss = {};
    for (const [k, v] of Object.entries(j.gloss || {})) gloss[String(k).toLowerCase()] = String(v);
    const st = {
      id, level: S.level, generated: true, created: Date.now(),
      title: String(j.title || "Cuento nuevo"), titleEn: String(j.titleEn || ""),
      paragraphs: j.paragraphs.filter(p => p && p.es).map(p => ({ es: String(p.es), en: String(p.en || "") })),
      targets: (j.targets || []).filter(t => t && t.es).map(t => ({ es: String(t.es), en: String(t.en || ""), match: (t.match || []).map(x => String(x).toLowerCase()) })),
      gloss,
      questions: (j.questions || []).filter(q => q && q.q && Array.isArray(q.options)).map(q => ({ q: String(q.q), options: q.options.map(String), answer: Math.max(0, Math.min(q.options.length - 1, +q.answer || 0)) }))
    };
    GEN[id] = st;
    S.genIds.push(id);
    lsSet("cyt_gen", GEN);
    if (Store.col) Store.col.doc("story_" + id).set(st).catch(e => console.warn(e));
    save(); buildDefs();
    toast("הסיפור מוכן!");
    go("reader", id);
  } catch (e) {
    console.warn(e);
    btn.disabled = false;
    status.textContent = e && e.code === "not_granted" ? "צריך לאשר ל־Claude גישה כדי ליצור סיפורים." : e && e.code === "rate_limited" ? "יותר מדי בקשות, נסה שוב בעוד דקה." : "משהו השתבש ביצירה. נסה שוב.";
  }
}

/* ============ reader ============ */
const Reader = {
  story: null, sents: [], playing: false, cur: -1,
  stop() { this.playing = false; stopSpeak(); this.mark(-1); this.updBtn(); },
  mark(i) {
    document.querySelectorAll(".sent.cur").forEach(e => e.classList.remove("cur"));
    this.cur = i;
    if (i >= 0) { const el = document.querySelector(`.sent[data-i="${i}"]`); if (el) { el.classList.add("cur"); const r = el.getBoundingClientRect(); if (r.top < 70 || r.bottom > innerHeight - 150) el.scrollIntoView({ block: "center", behavior: "smooth" }); } }
  },
  updBtn() { const b = $("#p-play"); if (b) b.innerHTML = this.playing ? "⏸" : "▶"; },
  async play(from) {
    stopSpeak();
    const run = ++TTS.run;
    this.playing = true; this.updBtn();
    for (let i = from; i < this.sents.length; i++) {
      if (!this.playing || run !== TTS.run) return;
      this.mark(i);
      await speak(this.sents[i], S.settings.rate);
      if (run !== TTS.run) return;
    }
    this.playing = false; this.mark(-1); this.updBtn();
  }
};
function renderReader(id) {
  const st = storyById(id);
  if (!st) return go("stories");
  Reader.story = st; Reader.sents = []; Reader.playing = false; Reader.cur = -1;
  const hl = S.settings.highlight;
  const formMap = STORY_FORM[st.id] || {};
  let si = 0;
  const parasHtml = st.paragraphs.map((p, pi) => {
    const sh = splitSentences(p.es).map(s => {
      Reader.sents.push(s);
      const inner = s.split(SPLIT_WORDS).map(t => {
        if (!IS_WORD.test(t)) return esc(t);
        const w = t.toLowerCase();
        const cid = formMap[w] || null;
        let cls = "w";
        if (hl && cid) { const stt = cardStatus(cid); cls += stt === "new" ? " tgt" : stt === "learning" ? " lrn" : ""; }
        else if (hl && GLOBAL_FORM[w] && cardStatus(GLOBAL_FORM[w]) === "learning") cls += " lrn";
        return `<span class="${cls}" data-w="${esc(t)}" data-s="${si}">${esc(t)}</span>`;
      }).join("");
      return `<span class="sent" data-i="${si++}">${inner}</span>`;
    }).join(" ");
    return `<div class="para"><p class="es" dir="ltr" lang="es">${sh}</p><button class="tr-btn" data-p="${pi}">EN</button><div class="tr" id="tr-${pi}" dir="ltr" hidden>${esc(p.en)}</div></div>`;
  }).join("");
  const r = S.read[st.id];
  main().innerHTML = `
  <div class="r-head">
    <button class="icon" id="r-back" aria-label="חזרה">→</button>
    <div><div class="eyebrow">${LV[st.level].icon} ${LV[st.level].es}${st.region && REGIONS[st.region] ? " · " + REGIONS[st.region].flag + " " + REGIONS[st.region].he : ""}${st.generated ? " · AI" : ""}</div><h2 class="r-title es" dir="ltr">${esc(st.title)}</h2><div class="muted small" dir="ltr">${esc(st.titleEn || "")}</div></div>
  </div>
  ${hl ? `<div class="legend"><span><i class="lg tgt"></i>מילה חדשה בסיפור</span><span><i class="lg lrn"></i>מילה בלמידה</span><span class="muted">הקש על כל מילה לתרגום</span></div>` : ""}
  <article class="story">${parasHtml}</article>
  <section class="quiz" id="quiz">
    <h3 class="h3"><bdi class="es">¿Entendiste?</bdi> <span class="muted small">שאלות הבנה</span></h3>
    ${st.questions.map((q, qi) => `<div class="q" data-q="${qi}"><div class="q-t es" dir="ltr">${qi + 1}. ${esc(q.q)}</div>${q.options.map((o, oi) => `<button class="opt es" dir="ltr" data-o="${oi}">${esc(o)}</button>`).join("")}</div>`).join("")}
    <div id="q-res">${r ? `<div class="muted small">ציון קודם: ${Math.round(r.score * 100)}%</div>` : ""}</div>
  </section>
  <div class="player">
    <button class="icon big" id="p-play" aria-label="נגן">▶</button>
    <div class="rates">${[0.7, 0.85, 1].map(x => `<button class="rate ${S.settings.rate === x ? "on" : ""}" data-r="${x}">${x}×</button>`).join("")}</div>
    <button class="icon" id="p-restart" aria-label="מההתחלה">⏮</button>
  </div>`;
  $("#r-back").onclick = () => go("stories");
  document.querySelectorAll(".tr-btn").forEach(b => b.onclick = () => { const t = $("#tr-" + b.dataset.p); t.hidden = !t.hidden; b.classList.toggle("on", !t.hidden); });
  $(".story").onclick = e => {
    const w = e.target.closest(".w"); if (!w) return;
    document.querySelectorAll(".w.sel").forEach(x => x.classList.remove("sel"));
    w.classList.add("sel");
    openWordSheet(w.dataset.w, st, Reader.sents[+w.dataset.s], +w.dataset.s);
  };
  $("#p-play").onclick = () => { if (Reader.playing) Reader.stop(); else Reader.play(Reader.cur >= 0 ? Reader.cur : 0); };
  $("#p-restart").onclick = () => Reader.play(0);
  document.querySelectorAll(".rate").forEach(b => b.onclick = () => { S.settings.rate = +b.dataset.r; save(); document.querySelectorAll(".rate").forEach(x => x.classList.toggle("on", x === b)); if (Reader.playing) Reader.play(Math.max(0, Reader.cur)); });
  // quiz
  const answers = {};
  document.querySelectorAll(".q").forEach(qe => {
    const qi = +qe.dataset.q, q = st.questions[qi];
    qe.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      if (qi in answers) return;
      const oi = +b.dataset.o; answers[qi] = oi === q.answer;
      qe.querySelectorAll(".opt").forEach((x, k) => { x.disabled = true; if (k === q.answer) x.classList.add("right"); });
      if (oi !== q.answer) b.classList.add("wrong");
      if (Object.keys(answers).length === st.questions.length) finishStory(st, answers);
    });
  });
}
function finishStory(st, answers) {
  const n = st.questions.length, c = Object.values(answers).filter(Boolean).length;
  const score = n ? c / n : 1;
  const prev = S.read[st.id];
  S.read[st.id] = { score: prev ? Math.max(prev.score, score) : score, date: Date.now() };
  bumpStreak(); save();
  const newIds = newQueue(st.id), dueIds = dueList(st.id);
  $("#q-res").innerHTML = `<div class="res">
    <div class="res-score">${c}/${n}</div>
    <div>${score === 1 ? '<bdi class="es">¡Perfecto!</bdi> הבנת הכול.' : score >= 0.67 ? '<bdi class="es">¡Bien!</bdi> הבנה טובה.' : "כדאי לקרוא שוב עם ההקראה 🎧"}</div>
    ${newIds.length + dueIds.length ? `<button class="btn primary big" id="q-practice">🃏 תרגל את ${newIds.length + dueIds.length} מילות הסיפור עכשיו</button>` : `<div class="muted small">כל מילות הסיפור כבר בתרגול שלך.</div>`}
    ${nextStory() ? `<button class="btn ghost" id="q-next">לסיפור הבא ←</button>` : ""}
  </div>`;
  if ($("#q-practice")) $("#q-practice").onclick = () => startSession("mixed", st.id);
  if ($("#q-next")) $("#q-next").onclick = () => go("reader", nextStory().id);
}

/* ============ word sheet ============ */
function closeSheet() { $("#sheet").classList.remove("on"); $("#scrim").classList.remove("on"); document.querySelectorAll(".w.sel").forEach(x => x.classList.remove("sel")); }
function openWordSheet(word, st, sentence, si, mode) {
  const w = word.toLowerCase();
  S.lookups[w] = (S.lookups[w] || 0) + 1;
  const g = lookup(w, st);
  const cid = (STORY_FORM[st.id] || {})[w] || GLOBAL_FORM[w] || ("u_" + slug(w));
  const sameCard = mode === "card" && SES && SES.q[SES.i] === cid;
  const def = getDef(cid);
  const inDeck = !!(S.cards[cid] || S.known[cid]);
  const lab = { new: "ממתינה לתרגול", learning: "בלמידה", stable: "יציבה", known: "ידועה" };
  const sh = $("#sheet");
  sh.innerHTML = `
    <div class="grip"></div>
    <div class="ws-top">
      <div><div class="ws-word es" dir="ltr">${esc(word)}</div>${g && g.lemma ? `<div class="muted small es" dir="ltr">${esc(g.lemma)}</div>` : def && def.es.toLowerCase() !== w ? `<div class="muted small es" dir="ltr">${esc(def.es)}</div>` : ""}</div>
      <button class="icon spk" id="ws-say" aria-label="הקרא">🔊</button>
    </div>
    <div class="ws-gloss" dir="ltr" id="ws-gloss">${g ? esc(g.gloss) : def ? esc(def.en) : `<span class="muted">אין תרגום שמור למילה הזו</span>`}</div>
    ${!g && !def ? `<div class="ws-ai">${Store.sample ? `<button class="btn ghost small" id="ws-ai">✨ תרגם עם Claude לפי ההקשר</button>` : ""}<a class="btn ghost small" target="_blank" rel="noopener" href="https://translate.google.com/?sl=es&tl=en&op=translate&text=${encodeURIComponent(sentence || word)}">Google Translate ↗</a></div>` : ""}
    <div class="ws-acts">
      ${sameCard ? `<div class="indeck">זו המילה של הכרטיסייה</div>` : inDeck ? `<div class="indeck">✓ בכרטיסיות · ${lab[cardStatus(cid)]}</div>` : `<button class="btn primary" id="ws-add">➕ הוסף לכרטיסיות</button>`}
      <button class="btn ghost" id="ws-sent">▶ הקרא את המשפט</button>
    </div>`;
  sh.classList.add("on"); $("#scrim").classList.add("on");
  $("#ws-say").onclick = () => speak(word, 0.85);
  $("#ws-sent").onclick = () => { if (mode === "card") speak(sentence, S.settings.rate); else { closeSheet(); Reader.play(si); } };
  if ($("#ws-add")) $("#ws-add").onclick = () => {
    if (DEFS[cid]) S.cards[cid] = { st: "new", added: Date.now() };
    else {
      const gl = lookup(w, st) || { gloss: "?" };
      S.cards[cid] = { st: "new", added: Date.now(), def: { id: cid, es: word.toLowerCase(), en: gl.gloss + (gl.lemma ? " (" + gl.lemma + ")" : ""), storyId: st.id, level: st.level || S.level, sentence: sentence || "", pi: si >= 0 ? paraOfSentence(st, si) : 0, match: [w] } };
    }
    save(); toast("נוסף לכרטיסיות ✓");
    openWordSheet(word, st, sentence, si, mode);
    refreshWordMarks();
  };
  if ($("#ws-ai")) $("#ws-ai").onclick = async () => {
    const b = $("#ws-ai"); b.disabled = true; b.textContent = "מתרגם…";
    try {
      const j = await askJSON(`Spanish word "${word}" in this sentence: "${sentence}". Return ONLY JSON: {"gloss":"short English meaning in this context","lemma":"dictionary form"}`, "quick");
      S.aiGloss[w] = String(j.gloss || "?") + (j.lemma ? " | " + j.lemma : "");
      save(); openWordSheet(word, st, sentence, si, mode);
    } catch (e) { b.textContent = "לא הצליח, נסה שוב"; b.disabled = false; }
  };
}
function paraOfSentence(st, si) { let k = 0; for (let pi = 0; pi < st.paragraphs.length; pi++) { k += splitSentences(st.paragraphs[pi].es).length; if (si < k) return pi; } return 0; }
function refreshWordMarks() {
  if (VIEW !== "reader" || !S.settings.highlight) return;
  const fm = STORY_FORM[Reader.story.id] || {};
  document.querySelectorAll(".story .w").forEach(el => {
    const w = el.dataset.w.toLowerCase(); const cid = fm[w] || GLOBAL_FORM[w] || (S.cards["u_" + slug(w)] ? "u_" + slug(w) : null);
    el.classList.remove("tgt", "lrn");
    if (!cid) return;
    const st = cardStatus(cid);
    if (fm[w] && st === "new") el.classList.add("tgt"); else if (st === "learning" || (S.cards[cid] && S.cards[cid].st === "new")) el.classList.add("lrn");
  });
}

/* ============ placement ============ */
let PT = null;
function renderPlacement() {
  if (!PT) PT = { band: 2, streak: 0, asked: new Set(), res: { 1: { c: 0, n: 0 }, 2: { c: 0, n: 0 }, 3: { c: 0, n: 0 } }, n: 0, max: 15, item: null, knownW: [] };
  if (PT.n >= PT.max) return finishPlacement();
  const pool = PLACEMENT.map((x, i) => ({ x, i })).filter(o => o.x.band === PT.band && !PT.asked.has(o.i));
  const pool2 = pool.length ? pool : PLACEMENT.map((x, i) => ({ x, i })).filter(o => !PT.asked.has(o.i));
  if (!pool2.length) return finishPlacement();
  const wantReading = PT.n % 4 === 3;
  const pick = pool2.find(o => !!o.x.r === wantReading) || pool2[Math.floor(Math.random() * pool2.length)];
  PT.item = pick; PT.asked.add(pick.i);
  const it = pick.x;
  const sentence = it.r ? "" : esc(it.s).replace(/\*(.+?)\*/, '<mark>$1</mark>');
  main().innerHTML = `
  <div class="ses-top"><button class="icon" id="pt-x">✕</button><div class="prog"><div style="width:${Math.round(PT.n / PT.max * 100)}%"></div></div><span class="muted small">${PT.n + 1}/${PT.max}</span></div>
  <section class="pt">
    <div class="eyebrow es" dir="ltr">${it.r ? "Lee el texto y responde." : "¿Qué significa la palabra destacada?"}</div>
    ${it.r ? `<div class="pt-pass es" dir="ltr">${esc(it.p)}</div><div class="pt-q es" dir="ltr">${esc(it.q)}</div>` : `<div class="pt-s es" dir="ltr">${sentence}</div>`}
    <div class="pt-opts">${it.opts.map((o, k) => `<button class="opt ${it.r ? "es" : ""}" dir="ltr" data-k="${k}">${esc(o)}</button>`).join("")}
    <button class="opt nose" data-k="-1">No sé · לא יודע</button></div>
  </section>`;
  $("#pt-x").onclick = () => { PT = null; go(S.placement.done ? "progress" : "welcome"); };
  document.querySelectorAll(".pt-opts .opt").forEach(b => b.onclick = () => {
    const ok = +b.dataset.k === it.a;
    const r = PT.res[it.band]; r.n++; if (ok) r.c++;
    if (ok && it.w) PT.knownW.push(it.w);
    if (ok) { PT.streak++; if (PT.streak >= 2 && PT.band < 3) { PT.band++; PT.streak = 0; } }
    else { PT.streak = 0; if (PT.band > 1) PT.band--; }
    PT.n++;
    renderPlacement();
  });
}
function finishPlacement() {
  const res = PT.res;
  let lvl = 1;
  for (const b of [3, 2]) { const r = res[b]; if (r.n >= 2 && r.c / r.n >= 0.7) { lvl = b; break; } }
  if (lvl === 1 && res[2].n >= 3 && res[2].c / res[2].n >= 0.6 && res[1].n && res[1].c / res[1].n >= 0.8) lvl = 2;
  S.level = lvl;
  S.placement = { done: true, date: Date.now(), res };
  for (const w of PT.knownW) { const id = "c_" + slug(w); if (DEFS[id] && DEFS[id].level < lvl) S.known[id] = true; }
  save(); PT = null;
  const L = LV[lvl];
  main().innerHTML = `<section class="done">
    <div class="done-emoji">${L.icon}</div>
    <div class="eyebrow">הרמה שלך</div>
    <h2 class="es" dir="ltr">${L.es} · ${L.cefr}</h2>
    <p>${L.desc}</p>
    <div class="pt-res">${[1, 2, 3].map(b => `<div><span>${LV[b].es}</span><b>${res[b].n ? Math.round(res[b].c / res[b].n * 100) + "%" : "—"}</b></div>`).join("")}</div>
    <p class="muted small">אפשר לשנות רמה ידנית או לעשות את המבחן שוב במסך "התקדמות". האפליקציה תציע לך לעלות רמה כשתהיה מוכן.</p>
    <button class="btn primary big" id="pt-go">יאללה, לסיפור הראשון 📖</button>
  </section>`;
  $("#pt-go").onclick = () => { const nx = nextStory(); nx ? go("reader", nx.id) : go("home"); };
}

/* ============ progress & settings ============ */
function renderProgress() {
  const counts = { new: 0, learning: 0, stable: 0, known: 0 };
  for (const id of Object.keys(DEFS).concat(Object.keys(S.cards).filter(i => !DEFS[i]))) counts[cardStatus(id)]++;
  const reads = Object.values(S.read);
  const avg = reads.length ? Math.round(reads.reduce((a, r) => a + r.score, 0) / reads.length * 100) : null;
  const L = LV[S.level];
  const st = S.settings;
  main().innerHTML = `
  <h2 class="h">התקדמות</h2>
  <section class="lvl-card">
    <div class="lvl-icon">${L.icon}</div>
    <div><div class="eyebrow">רמה נוכחית</div><div class="lvl-name es" dir="ltr">${L.es} · ${L.cefr}</div><div class="muted small">${L.desc}</div></div>
  </section>
  <div class="seg">${[1, 2, 3].map(l => `<button class="${S.level === l ? "on" : ""}" data-l="${l}">${LV[l].icon} ${LV[l].es}</button>`).join("")}</div>
  <button class="btn ghost" id="pg-test">🧪 מבחן רמה מחדש</button>
  <section class="grid4">
    <div><b>${counts.stable + counts.known}</b><span>מילים שנקלטו</span></div>
    <div><b>${counts.learning}</b><span>בלמידה</span></div>
    <div><b>${reads.length}</b><span>סיפורים שנקראו</span></div>
    <div><b>${avg === null ? "—" : avg + "%"}</b><span>ממוצע הבנה</span></div>
  </section>
  <h3 class="h3">הגדרות</h3>
  <section class="settings">
    <div class="set"><span>מילים חדשות ביום</span><div class="stepper"><button id="np-m">−</button><b>${st.newPerDay}</b><button id="np-p">+</button></div></div>
    ${toggle("autoplay", "הקראה אוטומטית בכרטיסיות", st.autoplay)}
    ${toggle("highlight", "סימון מילים חדשות/בלמידה בסיפור", st.highlight)}
    ${toggle("reverseMature", "לפעמים להפוך כרטיס בשל (אנגלית ← ספרדית)", st.reverseMature)}
    <div class="set"><span>קול הקראה</span><span class="muted small" dir="ltr">${esc(voiceLabel())}</span></div>
    <div class="set"><button class="btn ghost small" id="pg-voice">🔊 בדיקת קול</button></div>
  </section>
  <h3 class="h3">גיבוי</h3>
  <section class="settings">
    <div class="set"><span>שמירה</span><span class="muted small">${Store.status === "cloud" ? "☁️ בחשבון Claude + בטלפון" : "📱 שמור בטלפון הזה" + (INSTALL.persisted ? " (קבוע)" : "")}</span></div>
    ${Store.status !== "cloud" ? `<div class="set"><span class="muted small">הנתונים נשמרים רק במכשיר הזה ונשארים גם כשהאפליקציה מתעדכנת. מדי פעם כדאי ללחוץ "העתק גיבוי" ולשמור את הטקסט אצלך.</span></div>` : ""}
    <div class="set"><button class="btn ghost small" id="pg-copy">העתק גיבוי</button><button class="btn ghost small" id="pg-restore">שחזר מגיבוי</button></div>
    <textarea id="pg-ta" hidden placeholder="הדבק כאן את הגיבוי ולחץ שוב על שחזר" dir="ltr"></textarea>
  </section>
  <p class="muted small center">Cuentos y Tarjetas · אלגוריתם FSRS-4.5 · ${allStories().length} סיפורים · ${Object.keys(DEFS).length} מילות יעד</p>`;
  document.querySelectorAll(".seg button").forEach(b => b.onclick = () => { S.level = +b.dataset.l; save(); go("progress"); });
  $("#pg-test").onclick = () => { PT = null; go("placement"); };
  $("#np-m").onclick = () => { st.newPerDay = Math.max(3, st.newPerDay - 1); save(); renderProgress(); };
  $("#np-p").onclick = () => { st.newPerDay = Math.min(20, st.newPerDay + 1); save(); renderProgress(); };
  document.querySelectorAll(".tgl").forEach(b => b.onclick = () => { st[b.dataset.k] = !st[b.dataset.k]; save(); renderProgress(); });
  $("#pg-voice").onclick = () => speak("Hola Dror, ¿cómo estás? Vamos a leer un cuento.", st.rate);
  $("#pg-copy").onclick = async () => {
    const data = JSON.stringify({ state: S, gen: GEN });
    try { await navigator.clipboard.writeText(data); toast("הגיבוי הועתק"); }
    catch (e) { const ta = $("#pg-ta"); ta.hidden = false; ta.value = data; ta.select(); toast("העתק את הטקסט ידנית"); }
  };
  $("#pg-restore").onclick = () => {
    const ta = $("#pg-ta");
    if (ta.hidden || !ta.value.trim()) { ta.hidden = false; ta.value = ""; ta.focus(); return; }
    try {
      const j = JSON.parse(ta.value);
      S = normalize(j.state || j); GEN = j.gen || GEN;
      lsSet("cyt_gen", GEN);
      if (Store.col) for (const id of Object.keys(GEN)) Store.col.doc("story_" + id).set(GEN[id]).catch(() => { });
      buildDefs(); save(); toast("שוחזר ✓"); go("home");
    } catch (e) { toast("הגיבוי לא תקין"); }
  };
}
function toggle(k, label, on) { return `<div class="set"><span>${label}</span><button class="tgl ${on ? "on" : ""}" data-k="${k}" role="switch" aria-checked="${on}"><i></i></button></div>`; }

/* ============ install (GitHub Pages / PWA) ============ */
const INSTALL = { prompt: null, persisted: false };
const inClaude = () => !!(window.claude && typeof window.claude.use === "function");
const isStandalone = () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); INSTALL.prompt = e; if (VIEW === "home") renderHome(); });
window.addEventListener("appinstalled", () => { INSTALL.prompt = null; if (VIEW === "home") renderHome(); });
function installCard() {
  if (inClaude() || isStandalone() || S.installHidden || location.protocol === "file:") return "";
  return `<section class="install"><b>📲 להתקין כאפליקציה בטלפון</b>
    ${INSTALL.prompt ? `<p>בלחיצה אחת — ואז היא תיפתח מהמסך הראשי כמו כל אפליקציה.</p><button class="btn primary" id="h-install">התקן</button>`
      : isIOS() ? `<p>בספארי: כפתור השיתוף <b>⬆️</b> ← <b>"הוסף למסך הבית"</b>.</p>`
      : `<p>בכרום: תפריט <b>⋮</b> ← <b>"הוספה למסך הבית"</b> / <b>"התקנת אפליקציה"</b>.</p>`}
    <button class="btn ghost small" id="h-install-x">הסתר</button></section>`;
}
function setupPWA() {
  if (inClaude() || (location.protocol !== "https:" && location.hostname !== "localhost")) return;
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(e => console.warn("sw", e));
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(ok => { INSTALL.persisted = ok; }); } catch (e) { }
}

/* ============ boot ============ */
function boot() {
  S = normalize(lsGet("cyt_state"));
  GEN = lsGet("cyt_gen") || {};
  buildDefs(); rolloverDay();
  document.querySelectorAll("#nav button").forEach(b => b.onclick = () => go(b.dataset.v));
  $("#scrim").onclick = closeSheet;
  go(S.placement.done ? "home" : "welcome");
  setupPWA();
  initCloud();
}
document.addEventListener("DOMContentLoaded", boot);
