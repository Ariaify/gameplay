import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialState,migrateState,reducer,levelInfo,statsFor} from '../src/model.js';
test('bestaande spelers, punten, missies en berichten blijven behouden bij migratie',()=>{
 const state=initialState();const legacy=structuredClone(state);legacy.players=legacy.players.map(({portrait,goal,traits,...p})=>p);legacy.players[0].score=208;legacy.posts[0].text='Mijn eigen bericht';const next=migrateState(legacy);
 assert.equal(next.players[0].score,208);assert.equal(next.players[0].portrait,'nova');assert.equal(next.posts[0].text,'Mijn eigen bericht');assert.deepEqual(next.missions,legacy.missions);
});
test('eigen spelers krijgen een portret maar geen verzonnen doelen of eigenschappen',()=>{const state=initialState();state.players=[{id:'custom',name:'Jesse',role:'Spelleider',type:'hero',score:0}];const p=migrateState(state).players[0];assert.equal(p.goal,'');assert.deepEqual(p.traits,[]);assert.ok(p.portrait);});
test('een beoordeling kent precies eenmaal punten toe en schrijft het logboek',()=>{const initial=initialState(),a={type:'judge',id:'m1',result:'won',reason:'Goed uitgevoerd',logId:'l1',date:'2026-11-05'};const next=reducer(initial,a);assert.equal(next.players[0].score,145);assert.equal(initial.players[0].score,120);assert.equal(next.log.length,1);assert.equal(next.log[0].delta,25);assert.strictEqual(reducer(next,a),next);assert.equal(statsFor(next,'p1').won,1);});
test('minpunten, lege toelichting en ongeldige uitkomsten worden correct verwerkt',()=>{const s=initialState();const next=reducer(s,{type:'judge',id:'m2',result:'lost',reason:'Nieuwe kans morgen',logId:'l2',date:'2026-11-05'});assert.equal(next.players[1].score,80);assert.equal(next.log[0].delta,-5);assert.strictEqual(reducer(s,{type:'judge',id:'m1',result:'won',reason:' '}),s);assert.strictEqual(reducer(s,{type:'judge',id:'m1',result:'unknown',reason:'test'}),s);});
test('profiel bewerken bewaart punten, eigen avatar, doel en eigenschappen',()=>{const s=initialState();const next=reducer(s,{type:'save-player',player:{...s.players[0],name:'Nieuwe naam',score:999,image:'data:image/png;base64,example',goal:'Beter samenwerken',traits:['Creatief']}});assert.equal(next.players[0].score,120);assert.equal(next.players[0].goal,'Beter samenwerken');assert.ok(next.players[0].image);assert.deepEqual(next.players[0].traits,['Creatief']);});
test('missies vereisen een bestaande speler en geldige punten',()=>{const s=initialState(),m={id:'new',title:'Groei',description:'Een eerste stap',player:'p1',plus:10,minus:0};assert.equal(reducer(s,{type:'add-mission',mission:m}).missions.length,4);assert.strictEqual(reducer(s,{type:'add-mission',mission:{...m,player:'missing'}}),s);assert.strictEqual(reducer(s,{type:'add-mission',mission:{...m,plus:NaN}}),s);});
test('levels en voortgang blijven geldig bij negatieve punten',()=>{assert.deepEqual(levelInfo(-15),{level:1,progress:0,next:100,remaining:100});assert.deepEqual(levelInfo(120),{level:2,progress:20,next:200,remaining:80});});
test('aanmoedigen kan worden in- en uitgeschakeld',()=>{const s=initialState(),a={type:'like',id:'s1'};const next=reducer(s,a);assert.equal(next.posts[0].likes,1);assert.equal(next.posts[0].liked,true);const last=reducer(next,a);assert.equal(last.posts[0].likes,0);assert.equal(last.posts[0].liked,false);});

test('beschadigde records wissen de overige browsergegevens niet',()=>{
 const saved=initialState();
 saved.players[0].score=208;
 saved.players.unshift(null,{id:'broken',name:null,role:42,score:'geen getal',traits:[null,{naam:'Moedig'},'Creatief']});
 saved.missions.push(null,{...saved.missions[0],id:'orphan',player:'missing'});
 saved.posts.push(null,{id:'empty',text:null});
 saved.log.push(null,{id:'orphan-log',player:'missing',delta:10});
 const next=migrateState(saved);
 assert.equal(next.players.find(p=>p.id==='p1').score,208);
 assert.equal(next.players.find(p=>p.id==='broken').name,'Speler');
 assert.equal(next.players.find(p=>p.id==='broken').score,0);
 assert.deepEqual(next.players.find(p=>p.id==='broken').traits,['Creatief']);
 assert.equal(next.missions.length,3);
 assert.equal(next.posts.length,1);
 assert.equal(next.log.length,0);
});

test('migratie houdt geldige beoordelingen intact en herstelt ongeldige puntwaarden',()=>{
 const saved=reducer(initialState(),{type:'judge',id:'m1',result:'won',reason:'Goed gedaan',logId:'l1',date:'2026-11-05'});
 saved.missions[1].plus='30';
 saved.missions[1].minus=-5;
 const next=migrateState(saved);
 assert.equal(next.players[0].score,145);
 assert.equal(next.missions[0].status,'won');
 assert.deepEqual(next.log,saved.log);
 assert.equal(next.missions[1].plus,0);
 assert.equal(next.missions[1].minus,0);
 assert.strictEqual(reducer(next,{type:'judge',id:'m1',result:'won',reason:'Opnieuw'}),next);
});

test('dubbele records kunnen geen dubbele missies of berichten opleveren',()=>{
 const s=initialState();
 assert.strictEqual(reducer(s,{type:'add-mission',mission:s.missions[0]}),s);
 assert.strictEqual(reducer(s,{type:'post',post:s.posts[0]}),s);
 const saved=structuredClone(s);
 saved.players.push(saved.players[0]);saved.missions.push(saved.missions[0]);saved.posts.push(saved.posts[0]);
 const next=migrateState(saved);
 assert.equal(next.players.length,4);assert.equal(next.missions.length,3);assert.equal(next.posts.length,1);
});

test('ongeldige opgeslagen aanmoedigingen worden nooit negatief',()=>{
 const s=initialState();s.posts[0].liked=true;s.posts[0].likes=-3;
 const next=reducer(migrateState(s),{type:'like',id:'s1'});
 assert.equal(next.posts[0].likes,0);assert.equal(next.posts[0].liked,false);
});
