// Builds the single-file app: src/*.js + src/shell.html -> index.html
const fs = require('fs'), path = require('path');
const d = path.join(__dirname, 'src');
const order = ['stories.js', 'gloss.js', 'placement.js', 'gloss2.js', 'jerga.js', 'verbs.js', 'app.js', 'verbs-ui.js'];
const js = order.map(f => fs.readFileSync(path.join(d, f), 'utf8')).join('\n');
const html = fs.readFileSync(path.join(d, 'shell.html'), 'utf8').replace('<!--SCRIPTS-->', '<script>\n' + js.replace(/<\/script/gi, '<\\/script') + '\n</script>');
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('built index.html', html.length, 'bytes');
