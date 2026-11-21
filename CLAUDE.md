# Cuentos y Tarjetas — working rules

## Git workflow (owner's rule — always follow)
- **Every change starts on a new branch.** Never commit directly to `main`.
  Branch name: `feature/<short-description>` or `fix/<short-description>`.
- Commit and push the branch, then tell Dror what changed and what to check.
- **Merge into `main` only when Dror explicitly says to merge.** Then merge, push `main`,
  and republish the live artifact from `main`.

## Project layout
- `src/` — source. `shell.html` (HTML + CSS), `app.js` (app logic, FSRS, reader, cards),
  `verbs.js` + `verbs-ui.js` (conjugation engine + tenses screen), `stories.js`, `gloss.js`,
  `gloss2.js` (dictionaries), `jerga.js` (Latin American slang deck), `placement.js` (level test).
- `index.html` — the built single-file app. **Never edit by hand**: run `node build.js`.
- `docs/SPEC.md` — product spec, research basis and changelog. Update the changelog with every change.
- `tests/` — `node tests/check-gloss.js` (every word in stories/slang has a translation),
  `python3 tests/e2e*.py` (Playwright, phone viewport; set `CHROME_PATH` if needed).

## Before pushing
1. `node build.js`
2. `node tests/check-gloss.js` must report 0 missing.
3. Run the e2e tests; no page errors (font-loading network errors offline are fine).

## Content conventions
- Spanish is **Latin American** (Argentina / Colombia preferred): ustedes, no vosotros; voseo where natural.
- UI is Hebrew (RTL); Spanish/English content is wrapped `dir="ltr"`.
- Glosses: `"form": "english | lemma"`. Every new story word needs a gloss.

## Live app
Published as a Claude artifact: https://claude.ai/artifact/VG9uPZPJy9F59EmkXEDXZc
(slug `e4dd869e-9235-4762-98ad-acbe5b8195cb`; capabilities: db, user, sample, tts).
