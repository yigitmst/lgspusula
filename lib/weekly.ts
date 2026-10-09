import {type Log,type Exam,periodBounds,summarize,net} from './model';
export function shiftDate(date:string,days:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
export function weeklyComparison(logs:Log[],exams:Exam[],date:string,now:string){
 const full=periodBounds(date,'Haftalık'),end=full[0]<=now&&now<full[1]?now:full[1];
 const current=[full[0],end],previous=current.map(d=>shiftDate(d,-7));
 const within=(d:string,b:string[])=>d>=b[0]&&d<=b[1];
 const currentLogs=logs.filter(x=>within(x.date,current)),previousLogs=logs.filter(x=>within(x.date,previous));
 const a=summarize(previousLogs),b=summarize(currentLogs);
 const messages:string[]=[];
 if(!a.questions||!b.questions)messages.push('İki dönemde de soru kaydı olmadan gelişim kıyaslanamaz. Kayıt bulunmaması çalışma yapılmadığı anlamına gelmez.');
 else {
  const q=b.questions-a.questions,p=q/a.questions*100,d=b.accuracy!-a.accuracy!;
  const f=(n:number)=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1}).format(n);
  messages.push(q===0?`Soru sayın ${b.questions} ile aynı kaldı.`:`Soru sayın ${a.questions} → ${b.questions}; çalışma miktarın %${f(Math.abs(p))} ${q>0?'arttı':'azaldı'}.`);
  messages.push(`Doğru sayın ${a.correct} → ${b.correct}. Doğruluk oranın %${f(a.accuracy!)} → %${f(b.accuracy!)}; ${Math.abs(d)<0.05?'yaklaşık aynı kaldı':`${f(Math.abs(d))} yüzde puan ${d>0?'yükseldi':'düştü'}`}.`);
  if(q>0&&d>0)messages.push('Hem daha çok soru çözdün hem doğruluk oranını yükselttin.');
  if(q>0&&d<0)messages.push('Çalışma miktarın arttı; doğruluğun azaldı. Yanlış ve boşları inceleyip zorlandığın konuları tekrar et.');
  if(q<0&&d>0)messages.push('Daha az soru çözdün ama doğruluk oranın yükseldi; çalışma miktarını da hedefinle birlikte değerlendir.');
  if(q>0)messages.push(`Önceki doğruluk oranıyla ${f(b.questions*a.accuracy!/100)} doğru beklenirdi; bu hafta ${b.correct} doğru kaydedildi.`);
  if(a.questions<20||b.questions<20)messages.push('Dönemlerden birinde 20 sorudan az kayıt var; sonuçlar sınırlı örnekleme dayanıyor.');
 }
 const scope=(e:Exam)=>e.type+' · '+[...e.rows].sort((x,y)=>x.subject.localeCompare(y.subject)).map(r=>`${r.subject} (${r.total})`).join(', ');
 const groups=[...new Set(exams.filter(e=>within(e.date,current)||within(e.date,previous)).map(scope))].map(key=>{
  const old=exams.filter(e=>scope(e)===key&&within(e.date,previous)),recent=exams.filter(e=>scope(e)===key&&within(e.date,current));
  const mean=(list:Exam[])=>list.length?list.reduce((s,e)=>s+e.rows.reduce((v,r)=>v+net(r),0),0)/list.length:null;
  return {key,old,recent,before:mean(old),after:mean(recent)};
 });
 const comparable=groups.filter(g=>g.before!==null&&g.after!==null);
 if(!comparable.length)messages.push('Aynı tür ve soru dağılımında iki dönem denemesi bulunmadığı için net gelişimi kıyaslanamıyor.');
 else for(const g of comparable){const diff=g.after!-g.before!;messages.push(`${g.old[0].type} deneme ortalama neti ${diff===0?'aynı kaldı':`${new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1}).format(Math.abs(diff))} net ${diff>0?'arttı':'azaldı'}`}.`)}
 return {current,previous,currentLogs,previousLogs,a,b,messages,groups,partial:end!==full[1]};
}
