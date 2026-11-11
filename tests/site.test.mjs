import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../_site/', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');

test('all relative page resources exist in the deployable artifact', async () => {
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const ref of refs) {
    if (ref.startsWith('#')) {
      if (ref.length > 1) assert.ok(ids.has(ref.slice(1)), `Missing anchor: ${ref}`);
    } else if (!ref.startsWith('https://')) {
      assert.ok((await stat(path.join(root, ref))).isFile(), `Missing resource: ${ref}`);
    }
  }
});

test('deployment publishes only the static website, not tooling or source control files', async () => {
  const files = await readdir(root);
  assert.deepEqual(files.sort(), ['.nojekyll', 'app.js', 'assets', 'index.html', 'robots.txt', 'styles.css'].sort());
});

test('all interactive relationships and SVG references resolve to unique IDs', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs can break navigation and accessibility');
  for (const [, values] of html.matchAll(/(?:aria-labelledby|aria-describedby|aria-controls)="([^"]+)"/g)) {
    for (const id of values.split(' ')) assert.ok(ids.includes(id), `Missing accessible target ${id}`);
  }
});

test('site remains navigable and educational without JavaScript', () => {
  assert.match(html, /<noscript>[\s\S]*Find a spot[\s\S]*Life moves in[\s\S]*<\/noscript>/);
  assert.match(html, /<details><summary>Do beavers eat/);
  assert.match(html, /<a class="skip-link" href="#main">/);
  for (const [, attrs] of html.matchAll(/<img\b([^>]+)>/g)) {
    assert.match(attrs, /alt="[^"]+"/, 'Content photography needs meaningful alternate text');
    assert.match(attrs, /width="\d+"/);
    assert.match(attrs, /height="\d+"/);
  }
});
