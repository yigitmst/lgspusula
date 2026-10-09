import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';

const source = ts.transpileModule(fs.readFileSync(new URL('../lib/demo-request.ts', import.meta.url), 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022},
}).outputText;
const {requestDemoJson} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const original = globalThis.fetch;
try {
  globalThis.fetch = async () => Response.json({ok: true});
  assert.deepEqual(await requestDemoJson('/api/demo-login'), {ok: true});
  globalThis.fetch = async () => Response.json({error: 'Test kayıtlarına erişilemedi.'}, {status: 503});
  await assert.rejects(requestDemoJson('/api/tracker'), /Test kayıtlarına erişilemedi/);
  globalThis.fetch = async () => new Response('<html>Vercel</html>', {headers: {'content-type': 'text/html'}});
  await assert.rejects(requestDemoJson('/api/tracker'), /Vercel erişiminizi/);
  globalThis.fetch = async (_, init) => new Promise((_, reject) => {
    init.signal.addEventListener('abort', () => reject(new Error('aborted')));
  });
  await assert.rejects(requestDemoJson('/api/tracker', {}, 20), /zamanında yüklenemedi/);
  globalThis.fetch = async (_, init) => new Response(new ReadableStream({start(controller) {
    init.signal.addEventListener('abort', () => controller.error(new Error('aborted')));
  }}), {headers: {'content-type': 'application/json'}});
  await assert.rejects(requestDemoJson('/api/tracker', {}, 20), /zamanında yüklenemedi/);
  console.log('PASS: login, storage errors, platform HTML, stalled fetch and stalled body.');
} finally {
  globalThis.fetch = original;
}
