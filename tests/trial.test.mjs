import assert from 'node:assert/strict';
import test from 'node:test';
import {initialState} from '../src/model.js';
import {createTrial, questions, trialReducer} from '../src/trial.js';

test('één proefspeler naast het bestaande gilde met een direct speelbare missie', () => {
  const base = initialState();
  const state = createTrial(base);
  assert.deepEqual(state.players.slice(0, -1), base.players);
  assert.equal(state.players.at(-1).id, state.trial.id);
  assert.equal(state.missions[0].player, state.trial.id);
  assert.deepEqual(state.missions.slice(1), base.missions);
  const collision = createTrial({...base, players:state.players, missions:state.missions});
  assert.notEqual(collision.trial.id, state.trial.id);
  assert.equal(new Set(collision.missions.map(m=>m.id)).size, collision.missions.length);
});

test('alleen eigen verslag inleveren, eenmaal XP en feedback, gericht opnieuw beginnen', () => {
  const base = initialState();
  const state = createTrial(base);
  const id = state.missions[0].id;
  const judge = {type:'judge', id, result:'won', reason:'Goed geluisterd', logId:'beoordeling', date:'2026-11-19'};
  assert.equal(trialReducer(state, judge), state);
  assert.equal(trialReducer(state, {type:'trial-report', id:'m1', text:'Test'}), state);
  const submitted = trialReducer(state, {type:'trial-report', id, text:'Ik stelde een open vraag.'});
  assert.equal(trialReducer(submitted, {type:'trial-report', id, text:'Nogmaals'}), submitted);
  const reviewed = trialReducer(submitted, judge);
  assert.equal(reviewed.players.at(-1).score, 25);
  assert.equal(reviewed.missions[0].trialFeedback, judge.reason);
  assert.equal(trialReducer(reviewed, judge), reviewed);
  const reset = trialReducer(reviewed, {type:'trial-reset'});
  assert.deepEqual(reset, state);
});

test('gildeproef bewaart keuzes en laat bij een gelijke score de speler kiezen', () => {
  let state = createTrial(initialState());
  for (const [index, house] of ['dageraad','horizon','dageraad','horizon'].entries()) {
    state = trialReducer(state, {type:'trial-answer', index, house});
  }
  assert.equal(state.trial.answers.length, questions.length);
  assert.equal(trialReducer(state,{type:'trial-house',house:'hartwoud'}), state);
  state = trialReducer(state,{type:'trial-house',house:'horizon'});
  state = trialReducer(state,{type:'trial-first-mission',id:'mijn-stap',goal:'Vaker iets proberen',step:'Een route verkennen'});
  assert.equal(state.players.at(-1).goal,'Vaker iets proberen');
  assert.equal(state.missions[0].player,state.trial.id);
  assert.equal(state.missions[0].description,'Een route verkennen');
});
