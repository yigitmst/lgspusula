import data from './curriculum.json';
export type CurriculumUnit={name:string;url:string;topics:string[]};
export type CurriculumCourse={source:string;units:CurriculumUnit[]};
export const curriculum=data as Record<string,Record<string,CurriculumCourse>>;
export const curriculumYear='2026–2027';
export const curriculumChecked='7 Ekim 2026';
export const schoolSubjects=(grade:number)=>Object.keys(curriculum[String(grade)]||{});
export function topicOptions(grade:number,subject:string){const course=curriculum[String(grade)]?.[subject];return course?.units.flatMap(u=>[u.name,...u.topics.map(t=>u.name+' / '+t)])||[];}

export const questionSubjects=(grade:number)=>schoolSubjects(grade).filter(s=>!['Teknoloji ve Tasarım','Teknoloji Tasarım','Müzik','Beden Eğitimi ve Spor','Beden Eğitimi','Görsel Sanatlar','Bilişim Teknolojileri ve Yazılım'].includes(s));
