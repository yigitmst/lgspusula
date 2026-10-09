import type {Book,ReadingRecommendation} from './model';
export const resourceGrades=(book:Book)=>book.grades?.length?book.grades:[book.grade];
export const matchesGrade=(book:Book,grade:number)=>resourceGrades(book).includes(grade);
export const validGrades=(v:unknown):v is number[]=>Array.isArray(v)&&v.length>0&&v.length<=3&&new Set(v).size===v.length&&v.every(g=>[6,7,8].includes(g));
export const validRecommendation=(r:ReadingRecommendation)=>!!r.id&&typeof r.title==='string'&&!!r.title.trim()&&r.title.length<=200&&typeof r.author==='string'&&r.author.length<=150&&Number.isInteger(r.totalPages)&&r.totalPages>0&&r.totalPages<=100000&&validGrades(r.grades);
