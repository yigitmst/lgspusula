import {database} from '../db/store';
const cookieName='lgs_demo_session';
export const sessionSeconds=7*24*60*60;
export async function tokenHash(token:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
export function requestToken(req:Request){const value=req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);return value&&/^[a-f0-9]{64}$/.test(value)?value:null;}
export function sessionCookie(req:Request,token:string,clear=false){return `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear?0:sessionSeconds}${new URL(req.url).protocol==='https:'?'; Secure':''}`;}
export async function demoUser(req:Request){const token=requestToken(req);if(!token)return null;const hash=await tokenHash(token),row=await database().prepare('SELECT visitor_id FROM demo_sessions WHERE token_hash=? AND expires_at>?').bind(hash,Date.now()).first<{visitor_id:string}>();return row?{userId:row.visitor_id,email:'Demo Admin'}:null;}
