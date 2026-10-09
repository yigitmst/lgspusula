'use client';
import {BookOpen,ClipboardList,LibraryBig,ListChecks,NotebookTabs,Check} from 'lucide-react';
export default function StudyNavigation({teacher,tab,onSelect}:{teacher:boolean;tab:string;onSelect:(tab:string)=>void}){
 const sections=[
  {id:'daily',label:teacher?'Soru ve aktiviteler':'Kayıtlarım',detail:'Günlük çalışmalar',icon:ListChecks},
  ...(!teacher?[{id:'books',label:'Kaynaklarım',detail:'Kitap ve videolar',icon:LibraryBig}]:[]),
  {id:'exams',label:teacher?'Denemeler':'Denemelerim',detail:'Sonuçlar ve grafik',icon:ClipboardList},
  {id:'reading',label:'Kitap okuma',detail:'Liste ve ilerleme',icon:BookOpen},
  {id:'curriculum',label:'Ders konuları',detail:'Ünite ve başlıklar',icon:NotebookTabs},
 ];
 return <nav id="study-navigation" className={'studyNavigation '+(teacher?'teacherStudyNavigation':'studentStudyNavigation')} aria-label={teacher?'Öğrenci çalışmaları':'Çalışmalarım bölümleri'}>{sections.map(s=>{const active=tab===s.id||tab==='overview'&&s.id==='daily';return <button type="button" key={s.id} data-section={s.id} className={active?'studyNavItem chosen':'studyNavItem'} aria-current={active?'page':undefined} onClick={()=>onSelect(s.id)}><span className="studyNavIcon"><s.icon size={21}/></span><span className="studyNavLabel"><strong>{s.label}</strong><small>{s.detail}</small></span>{active&&<Check size={17} className="studyNavCheck" aria-hidden="true"/>}</button>})}</nav>
}
