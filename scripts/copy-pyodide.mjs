import { mkdir, copyFile } from 'node:fs/promises';
const files = [
  'pyodide.mjs',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];
await mkdir('public/pyodide', { recursive: true });
for (const file of files) await copyFile(`node_modules/pyodide/${file}`, `public/pyodide/${file}`);
console.log('Python local preparado: nenhum CDN necessário durante o jogo.');
