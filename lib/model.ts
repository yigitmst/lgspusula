export type Student={extraCourses?:string[];disabledCourses?:string[];courseTopics?:Record<string,string[]>;avatarId?:string;journey?:"rocket"|"sail"|"star"|"fireworks";avatarChosen?:boolean;gradeConfirmed?:boolean;id:string;name:string;grade:number;email:string;examDate:string;startDate:string};
export type Log={questionCount?:number;testLabel?:string;id:string;studentId:string;date:string;subject:string;topic:string;bookId:string;correct:number;wrong:number;blank:number;minutes:number;note:string};
export type Activity={channelId?:string;subject?:string;topic?:string;videoUrl?:string;id:string;studentId:string;date:string;kind:string;minutes:number;pages:number;note:string};
export type Exam={photoKey?:string;difficulty?:string;id:string;studentId:string;date:string;name:string;type:string;score:string;rows:{subject:string;total:number;correct:number;wrong:number;blank:number}[]};
export type Book={grades?:number[];shared?:boolean;photoKey?:string;id:string;name:string;publisher:string;grade:number;subject:string;type:string;url:string;checked:string;studentIds:string[]};
export type Goal={id:string;studentId:string;subject:string;weekly:number;accuracy:number};
export type Review={id:string;studentId:string;period:string;date:string;note:string};
export type Schedule={id:string;studentId:string;type:string;day:number;time:string;endTime?:string;date?:string;weekdays?:number[];repeatStart?:string;repeatEnd?:string;activity:string};
export type Holiday={id:string;studentId:string;date:string;label:string};
export type ReadingRecommendation={id:string;title:string;author:string;totalPages:number;grades:number[]};
export type ReadingBook={recommendationId?:string;id:string;studentId:string;title:string;author:string;totalPages:number;currentPage:number;status:'Listemde'|'Okuyorum'|'Bitirdim';started:string;finished:string;note:string};
export type ClassVideo={id:string;title:string;url:string;category:"Ders videosu"|"Motivasyon"|"Diğer";description:string;grades:number[]};
export type StudentNotification={id:string;studentId:string;kind:"resource"|"video"|"reading";title:string;message:string;createdAt:string;read:boolean};
export type MentorMeeting={id:string;studentId:string;date:string;time:string;participants:string;notes:string;nextSteps:string;developmentScore:number|null;meetingScore:number|null};
export type State={videos?:ClassVideo[];notifications?:StudentNotification[];mentorMeetings?:MentorMeeting[];readingRecommendations?:ReadingRecommendation[];reading?:ReadingBook[];holidays?:Holiday[];sourceNotes:{studentId:string;number:number;status:string;note:string}[];students:Student[];logs:Log[];activities:Activity[];exams:Exam[];books:Book[];goals:Goal[];reviews:Review[];schedules:Schedule[];topics:Record<string,string[]>};
export const subjects7=['Matematik','Fen','Türkçe','Sosyal Bilgiler','İngilizce','Din'];
export const subjects8=['Matematik','Fen','Türkçe','İnkılap Tarihi','İngilizce','Din'];
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const total=(x:{correct:number;wrong:number;blank:number})=>x.correct+x.wrong+x.blank;
export const net=(x:{correct:number;wrong:number})=>x.correct-x.wrong/3;
export function periodBounds(date:string,kind:string){const d=new Date(date+'T12:00:00Z');const iso=(x:Date)=>x.toISOString().slice(0,10);if(kind==='Aylık'){const a=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1,12)),b=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0,12));return [iso(a),iso(b)];}if(kind==='Tüm zamanlar')return ['0000-01-01','9999-12-31'];const day=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-day);const a=iso(d);d.setUTCDate(d.getUTCDate()+6);return[a,iso(d)];}
export function summarize(logs:Log[]){const questions=logs.reduce((s,x)=>s+total(x),0),correct=logs.reduce((s,x)=>s+x.correct,0),wrong=logs.reduce((s,x)=>s+x.wrong,0),blank=logs.reduce((s,x)=>s+x.blank,0);return{questions,correct,wrong,blank,accuracy:questions?correct/questions*100:null,days:new Set(logs.map(x=>x.date)).size,minutes:logs.reduce((s,x)=>s+x.minutes,0)};}
