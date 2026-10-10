import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
const source = ts.transpileModule(fs.readFileSync(new URL('../lib/demo-credentials.ts', import.meta.url), 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022},
}).outputText;
const {validDemoCredentials} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
for (const [username, password] of [['Admin', 'Admin'], ['admin', 'admin'], ['ADMIN', 'ADMIN'], [' Admin ', ' Admin '], ['Admin', 'admin']]) {
  assert.equal(validDemoCredentials(username, password), true);
}
for (const [username, password] of [['Admin', 'wrong'], ['wrong', 'Admin'], ['', ''], [null, 'Admin'], ['Admin', {}], [123, 123]]) {
  assert.equal(validDemoCredentials(username, password), false);
}
console.log('PASS: public demo credential case/edge-space tolerance; wrong and malformed credentials rejected.');
