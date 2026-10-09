import {withDemoBindings} from '../../../lib/runtime/request-bindings';
import {database} from '../../../db/store';
import {sessionSeconds,sessionCookie,tokenHash} from '../../../lib/demo-auth';
export const dynamic='force-dynamic';
async function POSTHandler(req:Request){try{const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return Response.json({error:'Geçersiz istek.'},{status:403});const body=await req.json() as {username?:unknown;password?:unknown};if(body.username!=='Admin'||body.password!=='Admin')return Response.json({error:'Kullanıcı adı veya şifre hatalı.'},{status:401});const bytes=crypto.getRandomValues(new Uint8Array(32)),token=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(''),visitorId=crypto.randomUUID(),db=database();await db.prepare('DELETE FROM demo_sessions WHERE expires_at<=?').bind(Date.now()).run();await db.prepare('INSERT INTO demo_sessions (token_hash,visitor_id,expires_at) VALUES (?,?,?)').bind(await tokenHash(token),visitorId,Date.now()+sessionSeconds*1000).run();return Response.json({ok:true},{headers:{'Set-Cookie':sessionCookie(req,token),'Cache-Control':'no-store'}});}catch(e){console.error(e);return Response.json({error:'Giriş yapılamadı. Yeniden deneyin.'},{status:503});}}

export const POST=withDemoBindings(POSTHandler);
