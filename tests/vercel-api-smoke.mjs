import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const base=process.env.LGS_TEST_URL||'http://127.0.0.1:4310';
let cookie='';
async function call(path,body,options={}) {
  const r=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{...(cookie?{cookie}:{}),...(body===undefined?{}:{'Content-Type':'application/json'}),...options.headers},...(body===undefined?{}:{body:JSON.stringify(body)}),...options});
  return r;
}
async function json(r){assert.equal(r.status,200,await r.clone().text());return r.json();}
assert.equal((await call('/api/tracker')).status,401);
assert.equal((await call('/api/demo-login',{username:'wrong',password:'wrong'})).status,401);
const login=await call('/api/demo-login',{username:'Admin',password:'Admin'});await json(login);
cookie=login.headers.get('set-cookie').split(';')[0];
let a=await json(await call('/api/tracker'));
assert.equal(a.state.students.length,4);
const sid=a.state.students.find(s=>s.grade===7).id;
const query='?view=student&studentId='+sid;
let student=await json(await call('/api/tracker'+query));
assert.equal(student.state.students.length,1);
assert.equal(student.state.mentorMeetings,undefined);
const book={id:randomUUID(),name:'Vercel smoke kitabı',publisher:'Kurmaca test',grade:7,grades:[7],subject:'Matematik',type:'Soru Bankası',url:'',checked:'',shared:true,studentIds:[]};
a.state.books.push(book);
a=await json(await call('/api/tracker',{state:a.state,revision:a.revision}));
student=await json(await call('/api/tracker'+query));
assert.ok(student.state.books.some(b=>b.id===book.id));
assert.ok(student.state.notifications.some(n=>n.kind==='resource'));
const l={id:randomUUID(),studentId:sid,date:'2026-10-07',subject:'Matematik',topic:'Test konusu',bookId:book.id,testLabel:'Vercel smoke '+randomUUID(),questionCount:10,correct:8,wrong:2,blank:0,minutes:15,note:''};
student.state.logs.push(l);
student=await json(await call('/api/tracker'+query,{state:student.state,revision:student.revision}));
assert.ok(student.state.logs.some(x=>x.id===l.id));
assert.equal((await call('/api/tracker'+query,{state:student.state,revision:student.revision-1})).status,409);
const message={id:randomUUID(),body:'Kurmaca test: öğretmen mesajı'};
await json(await call('/api/messages?studentId='+sid,message));
const conversation=await json(await call('/api/messages'+query));
assert.ok(conversation.messages.some(m=>m.id===message.id));
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aR1sAAAAASUVORK5CYII=','base64');
const photo=await json(await fetch(base+'/api/photos'+query,{method:'POST',headers:{cookie,'Content-Type':'image/png'},body:png}));
const readPhoto=await call('/api/photos'+query+'&key='+photo.key);
assert.equal(readPhoto.status,200);assert.equal(Buffer.compare(Buffer.from(await readPhoto.arrayBuffer()),png),0);
// A separate sign-in has a new dataset and cannot read another visitor's photo.
const originalCookie=cookie;cookie='';const other=await call('/api/demo-login',{username:'Admin',password:'Admin'});await json(other);cookie=other.headers.get('set-cookie').split(';')[0];
const isolated=await json(await call('/api/tracker'));assert.ok(!isolated.state.books.some(b=>b.id===book.id));
assert.equal((await call('/api/photos'+query+'&key='+photo.key)).status,404);
cookie=originalCookie;
await json(await call('/api/demo-reset',{}));
const reset=await json(await call('/api/tracker'));assert.ok(!reset.state.books.some(b=>b.id===book.id));
await json(await call('/api/demo-logout',{}));assert.equal((await call('/api/tracker')).status,401);
console.log('PASS: deployed API login, four original demo pupils, class resources, notifications, student test entry, revision conflicts, messages, private photos, visitor isolation, reset and logout.');
