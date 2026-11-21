# Cuentos y Tarjetas — working rules

## Git workflow (owner's rule — always follow)
- **Every change starts on a new branch.** Never commit directly to `main`.
  Branch name: `feature/<short-description>` or `fix/<short-description>`.
- Commit and push the branch, then tell Dror what changed and what to check.
- **Merge into `main` only when Dror explicitly says to merge.** Then merge and push `main` —
  GitHub Pages serves `main`, so every user's installed app updates on its next open.
  Also republish Dror's private Claude artifact with the same `index.html` (its link is kept out
  of this public repo; ask Dror for it if you don't have it).

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

## Hosting (GitHub Pages)
- Served from `main`, root folder: https://drorhiedman-bit.github.io/Spanish-learning-app/
- PWA: `manifest.webmanifest`, `sw.js` (network-first, so updates reach phones on next open), `icons/`.
- Each person's progress lives in their own browser's localStorage under the key `cyt_state`
  (generated stories: `cyt_gen`). **Never rename these keys or drop fields** — `normalize()` in
  `app.js` must keep accepting old saved state, so updates never wipe anyone's data.
- `python3 tests/pwa.py` checks: update arrives, data survives the update, offline works
  (serve the site first, see the file header).
