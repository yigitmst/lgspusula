export const avatars=[
{id:'fox',name:'Astro Tilki'},{id:'cat',name:'Kaptan Kedi'},{id:'robot',name:'Meraklı Robot'},{id:'panda',name:'Kaşif Panda'},
{id:'owl',name:'Sporcu Baykuş'},{id:'rabbit',name:'Bilimci Tavşan'},{id:'dragon',name:'Oyuncu Ejderha'},{id:'penguin',name:'Sanatçı Penguen'}];
export const avatarImage=(id?:string)=>'/avatars/'+(avatars.some(a=>a.id===id)?id:'fox')+'.webp';
