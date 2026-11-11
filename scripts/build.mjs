import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '_site');
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'assets', 'robots.txt', '.nojekyll']) {
  await cp(path.join(root, file), path.join(output, file), { recursive: true });
}
console.log('Static site built in _site.');
