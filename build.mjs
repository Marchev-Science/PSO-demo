import { readFile, mkdir, writeFile } from 'node:fs/promises';
const read = name => readFile(new URL(name, import.meta.url), 'utf8');
let html = await read('index.html');
const css = await read('style.css');
html = html.replace(/<link rel="stylesheet" href="style\.css[^\"]*">/, () => `<style>${css}</style>`);
for (const name of ['engine.js', 'app.js']) {
  const source = (await read(name)).replace(/<\/script/gi, '<\\/script');
  html = html.replace(new RegExp(`<script src="${name.replace('.', '\\.')}[^\"]*"><\\/script>`), () => `<script>${source}</script>`);
}
if (/<(?:script[^>]+src|link[^>]+stylesheet)/i.test(html)) throw new Error('External application assets remain in deployment');
if (!html.includes('color-scheme:only light') || !html.includes('field.style.height=size')) throw new Error('Missing theme or square-sizing fix');
await mkdir(new URL('_site/', import.meta.url), { recursive: true });
await writeFile(new URL('_site/index.html', import.meta.url), html);
console.log(`Bundled self-contained index.html (${Buffer.byteLength(html)} bytes)`);
