// Fails if any word in stories, questions or slang examples has no translation.
const fs = require('fs'), path = require('path');
const d = path.join(__dirname, '..', 'src');
eval(['stories.js', 'gloss.js', 'gloss2.js', 'jerga.js'].map(f => fs.readFileSync(path.join(d, f), 'utf8')).join('\n') + ';global.S=STORIES;global.G=GLOSS;global.G2=GLOSS2;global.J=JERGA;');
const set = new Set(); const add = x => x.split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/).forEach(t => t && set.add(t.toLowerCase()));
for (const s of S) { s.paragraphs.forEach(p => add(p.es)); s.questions.forEach(q => { add(q.q); q.options.forEach(add); }); }
J.forEach(j => add(j.ex));
const miss = [...set].filter(w => !(w in G) && !(w in G2)).sort();
console.log(set.size, 'unique words,', miss.length, 'missing');
if (miss.length) { console.log(miss.join(' ')); process.exit(1); }
