import {matchesGrade} from './class-resources';
import type {Log,Activity,Exam,State,Book} from './model';
const text=(v?:string)=>v?.trim()||'';
export const logKey=(l:Log)=>JSON.stringify([l.studentId,l.date,l.subject,text(l.topic),l.bookId,l.correct,l.wrong,l.blank,l.minutes,text(l.note),text(l.testLabel)]);
export const activityKey=(a:Activity)=>JSON.stringify([a.studentId,a.date,a.kind,a.minutes,a.pages,text(a.note),a.channelId||'',a.subject||'',text(a.topic),a.videoUrl||'']);
export const examRecordKey=(e:Exam)=>JSON.stringify([e.studentId,e.date,text(e.name),e.type,e.difficulty||'Belirtilmedi',e.score||'',e.photoKey||'',e.rows.map(r=>[r.subject,r.total,r.correct,r.wrong,r.blank]).sort((a,b)=>String(a[0]).localeCompare(String(b[0])))]);
export function uniqueRecords<T>(items:T[],key:(item:T)=>string):T[]{const seen=new Set<string>();return items.filter(i=>{const k=key(i);if(seen.has(k))return false;seen.add(k);return true})}
export function uniqueStudies(s:State):State{return {...s,logs:uniqueRecords(s.logs,logKey),activities:uniqueRecords(s.activities,activityKey),exams:uniqueRecords(s.exams,examRecordKey)}}
export const studentBooks=(books:Book[],sid:string,grade:number)=>books.filter(b=>matchesGrade(b,grade)&&(b.shared||b.studentIds.includes(sid)));
