import {examKey} from './comparison';
import {net,type Student,type Exam} from './model';
export function studentInspiration(student:Student,exams:Exam[]){
 const sorted=exams.filter(e=>e.studentId===student.id).slice().reverse().sort((a,b)=>b.date.localeCompare(a.date));
 const latest=sorted[0],before=latest?sorted.slice(1).find(e=>examKey(e)===examKey(latest)):undefined;
 const score=(e:Exam)=>e.rows.reduce((n,r)=>n+net(r),0),delta=latest&&before?score(latest)-score(before):null;
 const improved=delta!==null&&delta>.1,lower=delta!==null&&delta<-.1,theme=student.journey||'rocket';
 const visual=lower?(theme==='sail'?'sail':'rocket'):theme;
 const fmt=(n:number)=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1}).format(n);
 const themes={rocket:{title:'Küçük adımlar, yeni keşifler.',message:'Bugün bir konu seç. Beş soru çöz ve takıldığın yeri keşfet.'},sail:{title:'Kendi rotanı keşfet.',message:'Her günün rüzgârı farklıdır. Bugün kısa bir tekrar yap; sonra dinlenmeye de yer aç.'},star:{title:'Işığını adım adım keşfet.',message:'Bir sorunun nedenini anlamak da ilerlemedir. Bugün bir yanlışını yeniden incele.'},fireworks:{title:'Emeğini fark et, yoluna devam et.',message:'Tamamladığın küçük bir çalışmayı kaydet. Kendine dinlenmek için de zaman ayır.'}};
 const title=improved?'İlerlemen parlıyor!':lower?'Bir sonuç, yolun tamamı değil.':delta!==null?'Yeni bir keşfe yer var.':themes[theme].title;
 const message=improved?`Önceki benzer denemene göre ${fmt(delta!)} net ilerledin. İşe yarayan çalışmanı sürdür; dinlenmeyi de unutma.`:lower?'Bu denemede netin daha düşük olabilir; yeniden öğrenmek için bir yol var. Bir ders seç, üç yanlışını incele ve beş soruyla tekrar dene.':delta!==null?'Netin benzer seviyede. Bugün bir yanlışının nedenini bulmak yeni bir adım olabilir.':themes[theme].message;
 const gains=latest&&before?latest.rows.map(r=>({subject:r.subject,delta:net(r)-net(before.rows.find(b=>b.subject===r.subject)!)})).filter(g=>g.delta>.1):[];
 return{latest,before,delta,improved,lower,visual,title,message,gains};
}
