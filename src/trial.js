import {migrateState, readState, reducer} from './model.js';

export const TRIAL_KEY = 'levelup-gilde-proef-v1';
export const houses = {
  dageraad: {name:'Dageraad', icon:'sun', color:'#e9b56e', room:'De Vuurzaal', description:'Hier begint avontuur met iemand die de eerste stap durft te zetten.', prompt:'Welke kleine actie kun je vandaag al proberen?'},
  horizon: {name:'Horizon', icon:'compass', color:'#79c7df', room:'De Kaartenkamer', description:'Hier krijgt nieuwsgierigheid de ruimte om een andere route te verkennen.', prompt:'Welk klein experiment brengt je dichter bij je doel?'},
  hartwoud: {name:'Hartwoud', icon:'leaf', color:'#a2ce9c', room:'De Binnentuin', description:'Hier groeien ideeën door aandacht voor elkaar.', prompt:'Met wie zou je één stap naar je doel willen oefenen?'},
  runesmeders: {name:'Runesmeders', icon:'spark', color:'#c6a8f3', room:'De Runewerkplaats', description:'Hier worden losse ideeën een plan dat je kunt uitvoeren.', prompt:'Welke concrete stap kun je inplannen en afvinken?'}
};
export const questions = [
  {story:'Het gilde staat voor een gesloten poort. De zon gaat onder. Wat doe je?', answers:[
    ['dageraad','Ik stap naar voren en klop aan.'],['horizon','Ik zoek naar een spoor langs de muur.'],
    ['hartwoud','Ik vraag wie in de groep deze plek herkent.'],['runesmeders','Ik leg onze aanwijzingen bij elkaar.']]},
  {story:'Een nieuw gildelid gaat morgen voor het eerst op pad. Wat geef je mee?', answers:[
    ['hartwoud','Een uitnodiging om samen te vertrekken.'],['runesmeders','Een zelfgemaakte kaart met rustpunten.'],
    ['dageraad','Een afspraak om samen de eerste hindernis te nemen.'],['horizon','Een kompas met een onbekende route.']]},
  {story:'Je mag een avond vrij besteden in het gilde. Waar ben je te vinden?', answers:[
    ['runesmeders','In de werkplaats, waar ik een idee bouw.'],['hartwoud','Bij het vuur met iemand die net binnenkomt.'],
    ['horizon','In het archief op zoek naar een vergeten verhaal.'],['dageraad','Op het oefenveld voor een eerste poging.']]},
  {story:'Na de expeditie schrijf je één moment op. Welk moment kies je?', answers:[
    ['horizon','Toen we iets ontdekten wat niemand verwachtte.'],['dageraad','Toen iemand als eerste durfde te gaan.'],
    ['runesmeders','Toen alle onderdelen van ons plan werkten.'],['hartwoud','Toen twee teamgenoten elkaar vonden.']]}
];
export const preferences = [
  {name:'Energie', choices:['Eerst alleen','Samen beginnen'], tips:['Neem vijf minuten om je stap zelf voor te bereiden.','Nodig iemand uit om de eerste stap samen te doen.']},
  {name:'Leren', choices:['Een voorbeeld','Vrij verkennen'], tips:['Zoek één voorbeeld om mee te oefenen.','Probeer twee varianten en kies wat bij je past.']},
  {name:'Afwegen', choices:['Heldere criteria','Effect op mensen'], tips:['Schrijf op waaraan je merkt dat je stap gelukt is.','Vraag jezelf af voor wie deze stap verschil maakt.']},
  {name:'Aanpak', choices:['Vooraf plannen','Onderweg kiezen'], tips:['Zet je oefenmoment in je agenda.','Houd ruimte om je aanpak onderweg bij te stellen.']}
];
const freshTrial = id => ({id, answers:[], house:'', preferences:[], shared:false});
const sample = id => ({id, name:'Rune', type:'hero', role:'Proefspeler', portrait:'atlas', avatar:'✦', traits:[], score:0, goal:'', bio:'Een nieuw gildelid aan het begin van de gildeproef.'});
const hasText = (s, max) => typeof s==='string' && s.trim().length>0 && s.length<=max;
const validHouse = h => typeof h==='string' && Object.hasOwn(houses,h);
export function createTrial(base) {
  let id='proef-rune';
  while(base.players.some(p=>p.id===id)) id+='-test';
  return startTrial(base, id);
}
function startTrial(base, id) {
  let missionId=id+'-welkom';
  while(base.missions.some(m=>m.id===missionId)) missionId+='-test';
  const trial={...base,players:[...base.players,sample(id)],trial:freshTrial(id)};
  return reducer(trial, {type:'add-mission',mission:{
    id:missionId, player:id, title:'Breek het ijs', plus:25, minus:0,
    description:'Vraag een gildelid wat diegene deze week wil leren. Vertel in je verslag welke vraag je stelde en wat je ontdekte.'
  }});
}
export function readTrialState() {
  try {
    const data=JSON.parse(localStorage.getItem(TRIAL_KEY));
    if(data?.trial && Array.isArray(data.players)){
      const state=migrateState(data);
      if(typeof data.trial.id==='string' && state.players.some(p=>p.id===data.trial.id)){
        const t=data.trial;
        const answers=[];
        for(const answer of Array.isArray(t.answers)?t.answers.slice(0,questions.length):[]){
          if(!validHouse(answer)) break;
          answers.push(answer);
        }
        return {...state,trial:{...freshTrial(t.id),answers,house:validHouse(t.house)?t.house:'',
          preferences:preferences.map((_,i)=>[0,1].includes(t.preferences?.[i])?t.preferences[i]:null),shared:t.shared===true}};
      }
    }
  } catch { /* A fresh trial can still run with unavailable browser storage. */ }
  return createTrial(readState());
}
export function matches(answers) {
  const counts=Object.keys(houses).map(key=>[key,answers.filter(h=>h===key).length]);
  const max=Math.max(...counts.map(entry=>entry[1]));
  return counts.filter(entry=>entry[1]===max).map(entry=>entry[0]);
}
export function trialReducer(state,action){
  const t=state.trial;
  switch(action.type){
    case 'trial-answer':
      if(t.house || t.answers.length>=questions.length || !validHouse(action.house) || action.index!==t.answers.length) return state;
      return {...state, trial:{...t,answers:[...t.answers,action.house]}};
    case 'trial-back':
      return t.house?state:{...state,trial:{...t,answers:t.answers.slice(0,-1)}};
    case 'trial-house':
      if(t.house || t.answers.length!==questions.length || !matches(t.answers).includes(action.house)) return state;
      return {...state,trial:{...t,house:action.house}};
    case 'trial-goal': {
      if(!t.house || !hasText(action.goal,180)) return state;
      return {...state, players:state.players.map(p=>p.id===t.id?{...p,goal:action.goal.trim()}:p)};
    }
    case 'trial-first-mission': {
      if(!t.house || !hasText(action.goal,180) || !hasText(action.step,400) || state.missions.some(m=>m.player===t.id&&m.firstTrial)) return state;
      const updated=reducer(state,{type:'add-mission',mission:{id:action.id,player:t.id,title:'Mijn eerste stap',description:action.step.trim(),firstTrial:true,plus:25,minus:0}});
      return updated===state?state:trialReducer(updated,{type:'trial-goal',goal:action.goal});
    }
    case 'trial-style':
      if(!t.house || !Array.isArray(action.values) || action.values.length!==preferences.length || action.values.some(v=>v!==null&&v!==0&&v!==1)) return state;
      return {...state,trial:{...t,preferences:[...action.values],shared:action.shared===true}};
    case 'trial-report': {
      const m=state.missions.find(m=>m.id===action.id);
      if(!m || m.player!==t.id || m.status!=='open' || m.trialReport || !hasText(action.text,800)) return state;
      return {...state,missions:state.missions.map(x=>x===m?{...m,trialReport:action.text.trim()}:x)};
    }
    case 'judge': {
      const m=state.missions.find(m=>m.id===action.id);
      if(m?.player!==t.id) return reducer(state,action);
      if(!m.trialReport) return state;
      const updated=reducer(state,action);
      return updated===state?state:{...updated, missions:updated.missions.map(x=>x.id===m.id?{...x,trialFeedback:action.reason.trim()}:x)};
    }
    case 'trial-reset':
      return startTrial({...state,players:state.players.filter(p=>p.id!==t.id),missions:state.missions.filter(m=>m.player!==t.id),log:state.log.filter(l=>l.player!==t.id)}, t.id);
    case 'save-player':
      if(action.player?.id===t.id) return reducer(state,{...action,player:{...action.player,type:'hero'}});
      return reducer(state,action);
    default:return reducer(state,action);
  }
}
