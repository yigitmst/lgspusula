export type VideoChannel={id:string;name:string;subject:string;searchUrl:string};
const channels:[string,string,string][]=[
 ['partikul','Partikül Matematik','Matematik'],
 ['imt','Ortaokul Matematik-iMT Hoca','Matematik'],
 ['mehmet-fen','Mehmet HOCA ile FEN','Fen'],
 ['lgs-fen','LGSDEKİ FEN HOCAM','Fen'],
 ['sosyal-kale','Sosyal Kale','İnkılap Tarihi'],
 ['sosyal-dersligi','Sosyal Bilgiler Dersliği','İnkılap Tarihi'],
 ['rustu','Rüştü Hoca ile LGS Türkçe','Türkçe'],
 ['osman','Osman Sarı LGS','Türkçe'],
 ['idris','LGS Türkçe İdris Hoca','Türkçe'],
 ['jasmin','Ms. Jasmin ELT','İngilizce'],
 ['cebrail','Cebrail Hocam','Din'],
 ['dinmatik','Dinmatik Notlar','Din'],
];
export const videoChannels:VideoChannel[]=channels.map(([id,name,subject])=>({id,name,subject,searchUrl:'https://www.youtube.com/results?search_query='+encodeURIComponent(name)}));
export const videoSubject=(subject:string,grade:number)=>subject==='İnkılap Tarihi'&&grade!==8?'Sosyal Bilgiler':subject;

export function savedVideoLinks(records:import('./model').Activity[]){const result=new Map<string,{url:string;title:string;subject:string;channel:string;minutes:number}>();for(const a of [...records].sort((x,y)=>y.date.localeCompare(x.date))){if(a.kind!=='Video İzleme'||!a.videoUrl)continue;let u:URL;try{u=new URL(a.videoUrl)}catch{continue}if(!['https:','http:'].includes(u.protocol)||u.username||u.password)continue;u.hash='';const key=u.href,existing=result.get(key);if(existing){existing.minutes+=a.minutes;continue}result.set(key,{url:key,title:a.topic||a.note||'Kaydedilen video',subject:a.subject||'Video',channel:videoChannels.find(c=>c.id===a.channelId)?.name||'Video kaynağı',minutes:a.minutes})}return [...result.values()]}
