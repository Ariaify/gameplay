export const STORAGE_KEY = 'levelup-world-v2';
export const ARCHETYPES = {
  nova: { name: 'Zonwachter', color: '#e6b267', symbol: 'sun', className: 'nova', caption: 'Verbinding & moed' },
  atlas: { name: 'Verkenner', color: '#73b8ca', symbol: 'compass', className: 'atlas', caption: 'Nieuwsgierigheid & actie' },
  echo: { name: 'Hoeder', color: '#9dc49c', symbol: 'leaf', className: 'echo', caption: 'Aandacht & balans' },
  shadow: { name: 'Schaduw', color: '#ad93e7', symbol: 'moon', className: 'shadow', caption: 'Fictieve tegenkracht' },
};
const seedPlayers = [
  { id: 'p1', name: 'Nova', avatar: '☀️', role: 'Verbinder', type: 'hero', bio: 'Brengt mensen samen en maakt ruimte voor nieuwe ideeën.', score: 120, portrait: 'nova', goal: 'Meer echte verbinding maken, één goed gesprek tegelijk.', traits: ['Empathisch', 'Moedig', 'Verbindend'] },
  { id: 'p2', name: 'Atlas', avatar: '🧭', role: 'Ontdekker', type: 'hero', bio: 'Zoekt elke dag een uitdaging buiten de comfortzone.', score: 85, portrait: 'atlas', goal: 'Elke week iets doen wat ik nog niet eerder durfde.', traits: ['Nieuwsgierig', 'Vindingrijk', 'Avontuurlijk'] },
  { id: 'p3', name: 'Echo', avatar: '🌿', role: 'Bewaker', type: 'hero', bio: 'Luistert, reflecteert en helpt anderen groeien.', score: 60, portrait: 'echo', goal: 'Beter luisteren naar mezelf en de mensen om me heen.', traits: ['Aandachtig', 'Geduldig', 'Betrokken'] },
  { id: 'p4', name: 'De Schaduw', avatar: '🌑', role: 'Uitdager', type: 'npc', bio: 'Een fictieve tegenstander die uitstelgedrag verbeeldt. Zijn kracht groeit wanneer een eerste stap wordt uitgesteld.', score: 40, portrait: 'shadow', goal: 'Spelers uitdagen om vandaag hun eerste stap te zetten.', traits: ['Mysterieus', 'Listig', 'Fictief'] },
];
export function initialState(){return { players: seedPlayers.map(p=>({...p,traits:[...p.traits]})), missions: [
 {id:'m1',title:'Een klein gebaar, groot verschil',description:'Help iemand uit je omgeving. Vertel wat je deed en wat je ervan leerde.',player:'p1',plus:25,minus:5,status:'open'},
 {id:'m2',title:'Stap buiten je comfortzone',description:'Begin een gesprek met iemand die je nog niet goed kent.',player:'p2',plus:30,minus:5,status:'open'},
 {id:'m3',title:'Versla de uitstelgedachte',description:'Schrijf één uitstelgedachte op en zet daar een concrete eerste stap tegenover.',player:'p3',plus:20,minus:0,status:'open'},
 ], posts:[{id:'s1',author:'Spelleider',text:'Welkom in LevelUp World! 🌱 Hier groeien we samen. Begin klein, moedig elkaar aan en maak van elke missie een stap vooruit.',likes:0,liked:false,date:new Date().toISOString()}],log:[] };}
export function migrateState(value){
 if(!value||!Array.isArray(value.players)||!Array.isArray(value.missions)||!Array.isArray(value.posts)||!Array.isArray(value.log))return initialState();
 return {...value,players:value.players.map((p,i)=>{
  const seed=seedPlayers.find(x=>x.id===p.id&&x.name===p.name);
  return {...p,portrait:ARCHETYPES[p.portrait]?p.portrait:p.type==='npc'?'shadow':seed?.portrait||['nova','atlas','echo'][i%3],goal:typeof p.goal==='string'?p.goal:seed?.goal||'',traits:Array.isArray(p.traits)?p.traits:seed?.traits||[],image:typeof p.image==='string'?p.image:''};
 })};
}
export function readState(){try{const raw=localStorage.getItem(STORAGE_KEY);return raw?migrateState(JSON.parse(raw)):initialState();}catch{return initialState();}}
export function levelInfo(score){const safe=Math.max(0,score);const level=Math.floor(safe/100)+1;return {level,progress:safe%100,next:level*100,remaining:level*100-safe};}
export function statsFor(state,id){const missions=state.missions.filter(m=>m.player===id);return {open:missions.filter(m=>m.status==='open').length,won:missions.filter(m=>m.status==='won').length,total:missions.length};}
export function reducer(state,action){
 switch(action.type){
  case 'save-player': {
   const p=action.player;
   if(!p.name?.trim()||!p.role?.trim())return state;
   const exists=state.players.some(x=>x.id===p.id);
   return {...state,players:exists?state.players.map(x=>x.id===p.id?{...x,...p,score:x.score}:x):[...state.players,{...p,score:0}]};
  }
  case 'add-mission': {
   const m=action.mission;
   if(!state.players.some(p=>p.id===m.player)||!m.title?.trim()||!m.description?.trim()||![m.plus,m.minus].every(n=>Number.isInteger(n)&&n>=0&&n<=10000))return state;
   return {...state,missions:[{...m,status:'open'},...state.missions]};
  }
  case 'judge': {
   const m=state.missions.find(m=>m.id===action.id);
   if(!m||m.status!=='open'||!action.reason?.trim()||!['won','lost'].includes(action.result))return state;
   const delta=action.result==='won'?m.plus:-m.minus;
   return {...state,missions:state.missions.map(x=>x.id===m.id?{...x,status:action.result}:x),players:state.players.map(p=>p.id===m.player?{...p,score:p.score+delta}:p),log:[...state.log,{id:action.logId,player:m.player,title:m.title,delta,reason:action.reason,date:action.date}]};
  }
  case 'post': return action.post.text.trim()?{...state,posts:[action.post,...state.posts]}:state;
  case 'like': return {...state,posts:state.posts.map(p=>p.id===action.id?{...p,liked:!p.liked,likes:p.likes+(p.liked?-1:1)}:p)};
  default:return state;
 }
}
