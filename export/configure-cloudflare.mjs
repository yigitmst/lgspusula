// Optional standalone Cloudflare build configuration. Original sources stay unchanged.
import { readFileSync, writeFileSync } from 'node:fs';
const target = new URL('../dist/server/wrangler.json', import.meta.url);
const required = ['CLOUDFLARE_D1_DATABASE_ID', 'CLOUDFLARE_D1_DATABASE_NAME', 'CLOUDFLARE_R2_BUCKET_NAME', 'CLOUDFLARE_WORKER_NAME'];
for (const key of required) {
  if (!process.env[key]?.trim()) throw new Error(`Missing ${key}; complete your local .env file.`);
}
const config = JSON.parse(readFileSync(target, 'utf8'));
config.name = process.env.CLOUDFLARE_WORKER_NAME;
if (process.env.CLOUDFLARE_ACCOUNT_ID) config.account_id = process.env.CLOUDFLARE_ACCOUNT_ID;
config.d1_databases = [{ binding: 'DB', database_name: process.env.CLOUDFLARE_D1_DATABASE_NAME, database_id: process.env.CLOUDFLARE_D1_DATABASE_ID, migrations_dir: '../../drizzle' }];
config.r2_buckets = [{ binding: 'BUCKET', bucket_name: process.env.CLOUDFLARE_R2_BUCKET_NAME }];
writeFileSync(target, JSON.stringify(config, null, 2) + '\n');
console.log('Generated Cloudflare build configuration updated. No application source changed.');
