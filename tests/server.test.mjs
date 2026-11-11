import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('preview serves generated files with correct MIME types and rejects missing or escaped paths', async (t) => {
  const child = spawn(process.execPath, ['scripts/serve.mjs'], {
    env: { ...process.env, PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(() => child.kill());
  let errors = '';
  child.stderr.on('data', (data) => { errors += data; });
  const output = await Promise.race([
    once(child.stdout, 'data').then(([data]) => data.toString()),
    once(child, 'exit').then(([code]) => { throw new Error(`Preview exited ${code}: ${errors}`); }),
  ]);
  const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
  assert.ok(url, output);
  const index = await fetch(url);
  assert.equal(index.status, 200);
  assert.match(index.headers.get('content-type'), /text\/html/);
  assert.match(await index.text(), /Small paws/);
  const script = await fetch(`${url}/app.js`);
  assert.equal(script.status, 200);
  assert.match(script.headers.get('content-type'), /javascript/);
  assert.equal((await fetch(`${url}/missing.html`)).status, 404);
  assert.equal((await fetch(`${url}/%2e%2e%2fpackage.json`)).status, 403);
  assert.equal((await fetch(`${url}/assets`)).status, 404);
});
