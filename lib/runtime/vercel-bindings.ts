// Test-only compatibility layer: original D1 SQL and API validations are preserved.
// Each demo visitor gets an isolated private SQLite snapshot in Vercel Blob.
import { AsyncLocalStorage } from 'node:async_hooks';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { createHash, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';

type Scope = { sql: DatabaseSync; file: string; session: string | null; etag?: string };
const scopes = new AsyncLocalStorage<Scope>();
const migrations = ['0000_true_skreet.sql', '0001_whole_agent_zero.sql', '0002_gigantic_banshee.sql', '0003_tearful_cammi.sql'];
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const key = (session: string) => `lgspusula-demo/v1/${session}/state.sqlite`;
function scope() { const s = scopes.getStore(); if (!s) throw new Error('Demo database requires a request context.'); return s; }
function inputs(args: unknown[]) { return args as SQLInputValue[]; }
const database = {
  prepare(query: string) {
    let values: unknown[] = [];
    return {
      bind(...args: unknown[]) { values = args; return this; },
      async first<T>() { return (scope().sql.prepare(query).get(...inputs(values)) ?? null) as T | null; },
      async all<T>() { return { results: scope().sql.prepare(query).all(...inputs(values)) as T[] }; },
      async run() { const r = scope().sql.prepare(query).run(...inputs(values)); return { success: true, meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
    };
  },
  async batch(statements: { run(): Promise<unknown> }[]) {
    const db = scope().sql; db.exec('BEGIN');
    try { const results = []; for (const s of statements) results.push(await s.run()); db.exec('COMMIT'); return results; }
    catch (e) { db.exec('ROLLBACK'); throw e; }
  },
};
const bucket = {
  async put(photoKey: string, bytes: ArrayBuffer, options: { httpMetadata: { contentType: string }; customMetadata: Record<string, string> }) {
    const s = scope(); if (!s.session) throw new Error('Sign in first.');
    const pathname = `lgspusula-demo/v1/${s.session}/photos/${photoKey}`;
    await put(pathname, bytes, { access: 'private', addRandomSuffix: false, contentType: options.httpMetadata.contentType });
    s.sql.prepare('INSERT INTO demo_photos (id,pathname,metadata,content_type) VALUES (?,?,?,?)').run(photoKey, pathname, JSON.stringify(options.customMetadata), options.httpMetadata.contentType);
  },
  async head(photoKey: string) {
    const row = scope().sql.prepare('SELECT metadata,content_type FROM demo_photos WHERE id=?').get(photoKey);
    return row ? { customMetadata: JSON.parse(String(row.metadata)), httpMetadata: { contentType: String(row.content_type) } } : null;
  },
  async get(photoKey: string) {
    const row = scope().sql.prepare('SELECT pathname,metadata,content_type FROM demo_photos WHERE id=?').get(photoKey);
    if (!row) return null;
    const result = await get(String(row.pathname), { access: 'private', useCache: false });
    return result?.statusCode === 200 ? { body: result.stream, customMetadata: JSON.parse(String(row.metadata)), httpMetadata: { contentType: String(row.content_type) } } : null;
  },
};
export const env = new Proxy({}, { get: (_, property) => property === 'DB' ? database : property === 'BUCKET' ? bucket : undefined }) as Cloudflare.Env;

export function withDemoBindings(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    // Existing Cloudflare unit tests keep their original mocked bindings.
    if (process.env.LGS_RUNTIME !== 'vercel-demo') return handler(req);
    if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: 'Test veritabanı yapılandırması eksik.' }, { status: 503 });
    const token = req.headers.get('cookie')?.match(/(?:^|;\s*)lgs_demo_session=([a-f0-9]{64})(?:;|$)/)?.[1];
    const session = new URL(req.url).pathname === '/api/demo-login' ? null : token ? hash(token) : null;
    const file = join('/tmp', `lgs-${randomUUID()}.sqlite`);
    let sql: DatabaseSync | undefined;
    try {
      const stored = session ? await get(key(session), { access: 'private', useCache: false }) : null;
      if (stored?.statusCode === 200) writeFileSync(file, Buffer.from(await new Response(stored.stream).arrayBuffer()));
      sql = new DatabaseSync(file);
      if (!stored) for (const name of migrations) sql.exec(readFileSync(join(process.cwd(), 'drizzle', name), 'utf8'));
      sql.exec('CREATE TABLE IF NOT EXISTS demo_photos (id TEXT PRIMARY KEY,pathname TEXT NOT NULL,metadata TEXT NOT NULL,content_type TEXT NOT NULL)');
      const s: Scope = { sql, file, session, etag: stored?.blob.etag };
      return await scopes.run(s, async () => {
        const before = Number(s.sql.prepare('SELECT total_changes() AS n').get()!.n);
        const response = await handler(req);
        const changed = Number(s.sql.prepare('SELECT total_changes() AS n').get()!.n) !== before;
        if (changed && response.ok) {
          const newToken = response.headers.get('set-cookie')?.match(/lgs_demo_session=([a-f0-9]{64})/)?.[1];
          const target = newToken ? hash(newToken) : s.session;
          if (target) {
            s.sql.close(); sql = undefined;
            await put(key(target), readFileSync(file), { access: 'private', contentType: 'application/vnd.sqlite3', addRandomSuffix: false, allowOverwrite: !!s.etag, ...(s.etag ? { ifMatch: s.etag } : {}) });
          }
        }
        return response;
      });
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError) return Response.json({ error: 'Başka bir sekmede değişiklik yapıldı. Güncel kayıtları yükleyip tekrar deneyin.' }, { status: 409 });
      // Avoid logging storage URLs, session keys or tokens.
      console.error('LGSPusula test storage request failed:', e instanceof Error ? e.name : 'UnknownError');
      return Response.json({ error: 'Test kayıtlarına erişilemedi. Yeniden deneyin.' }, { status: 503 });
    } finally { sql?.close(); rmSync(file, { force: true }); }
  };
}
