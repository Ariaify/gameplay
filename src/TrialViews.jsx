import React, {useState} from 'react';
import Icon from './Icon.jsx';
import {houses, matches, preferences, questions} from './trial.js';
import {levelInfo} from './model.js';
import './trial.css';

export function ModeSwitch({player, id, name}) {
  return <nav className="trial-switch" aria-label="Testweergave">
    <span className="trial-mark">Testomgeving</span>
    <a href={player?`#spelers/${id}`:'#spelers'} aria-current={!player?'page':undefined}><Icon name="crown"/>Spelleider</a>
    <a href="#proefspeler" aria-current={player?'page':undefined}><Icon name="users"/>Proefspeler <span>· {name}</span></a>
  </nav>;
}

export function TrialDesk({state, profile=false, reset}) {
  const {trial}=state, p=state.players.find(p=>p.id===trial.id);
  const house=houses[trial.house], missions=state.missions.filter(m=>m.player===p.id);
  const waiting=missions.filter(m=>m.trialReport && m.status==='open').length;
  return <section className="panel trial-desk">
    <div><div className="section-kicker"><Icon name={house?.icon||'compass'}/> PROEFSPELER</div>
      <h2>{p.name}{house?' · Huis '+house.name:''}</h2>
      <p>{waiting ? `${waiting} ${waiting===1?'verslag wacht':'verslagen wachten'} op je beoordeling.`
        : house ? p.goal||'Het eerste doel wordt gekozen.' : trial.answers.length ? `Gildeproef · ${trial.answers.length} van ${questions.length} keuzes gemaakt.` : `Speel een missie als ${p.name} en beoordeel het verslag als spelleider.`}</p>
      {profile&&trial.shared&&<p><b>Gedeelde speelstijl</b> · {preferences.map((axis,i)=>axis.choices[trial.preferences[i]]||'Wisselt').join(' · ')}</p>}
    </div>
    <div className="trial-actions">{!profile&&<a className="button button-secondary" href={`#spelers/${p.id}`}>{waiting?'Bekijk verslag':'Bekijk proefprofiel'}</a>}
      <a className="button button-primary" href="#proefspeler">Speel als {p.name}</a>
      {profile&&<button className="text-button" onClick={reset}>Proefspeler opnieuw starten</button>}
    </div>
  </section>;
}

function GuildQuiz({trial,dispatch}) {
  const step=trial.answers.length, q=questions[step];
  return <section className="panel trial-scene" aria-label="Gildeproef">
    <div className="trial-steps" aria-hidden="true">{questions.map((_,i)=><i className={i<step?'filled':''} key={i}/>)}</div>
    {q ? <><div className="eyebrow">DE INWIJDING · KEUZE {step+1} VAN {questions.length}</div>
      <h2>{q.story}</h2><div className="trial-choices">{q.answers.map(([h,text],i)=>
        <button key={h} onClick={()=>dispatch({type:'trial-answer',house:h,index:step})}><span>{'ABCD'[i]}</span>{text}</button>)}</div></>
      : <><div className="eyebrow">DE UITKOMST</div><h2>{matches(trial.answers).length===1?'Je huis heeft je gevonden.':'Welk huis voelt als jouw plek?'}</h2>
        <p>{matches(trial.answers).length===1?'Dit huis past bij jouw keuzes.':'Deze huizen passen even goed bij je antwoorden. Jij beslist waar je begint.'}</p>
        <div className="trial-choices">{matches(trial.answers).map(key=><button key={key} className="trial-house-choice" style={{'--house':houses[key].color}} onClick={()=>dispatch({type:'trial-house',house:key})}>
          <Icon name={houses[key].icon}/><div><b>Kies huis {houses[key].name}</b><p>{houses[key].description}</p></div></button>)}</div></>}
    {step>0&&<button className="text-button" onClick={()=>dispatch({type:'trial-back'})}>Vorige keuze</button>}
  </section>;
}

function FirstMission({player,house,dispatch}) {
  const [goal,setGoal]=useState(player.goal),[step,setStep]=useState('');
  return <form className="panel standard-form trial-form" onSubmit={e=>{
    e.preventDefault();dispatch({type:'trial-first-mission',goal,step,id:crypto.randomUUID()});
  }}>
    <div><div className="eyebrow">MIJN EERSTE MISSIE</div><h2>Waar wil jij dit seizoen in groeien?</h2></div>
    <label>Mijn persoonlijke doel<input required maxLength={180} value={goal} onChange={e=>setGoal(e.target.value)} placeholder="Ik wil vaker mijn ideeën delen."/></label>
    <label>{house.prompt}<textarea required maxLength={400} value={step} onChange={e=>setStep(e.target.value)} placeholder="Vrijdag vertel ik een teamgenoot over één van mijn ideeën."/></label>
    <button className="button button-primary" disabled={!goal.trim()||!step.trim()}>Start mijn eerste missie</button>
  </form>;
}

function PlayerMission({mission:m,dispatch}) {
  const [text,setText]=useState('');
  const status=m.status==='won'?'Behaald':m.status==='lost'?'Niet behaald':m.trialReport?'Ingeleverd bij de spelleider':'Klaar om te spelen';
  return <article className="panel trial-mission">
    <div className="trial-line"><div className="section-kicker"><Icon name="flag"/>{status}</div><span className="reward">+{m.plus} XP bij behalen</span></div>
    <h3>{m.title}</h3><p>{m.description}</p>
    {m.trialReport ? <div className="trial-note"><b>Mijn verslag</b><p>{m.trialReport}</p></div> : m.status==='open'&&
      <form className="standard-form" onSubmit={e=>{e.preventDefault();dispatch({type:'trial-report',id:m.id,text});}}>
        <label>Mijn verslag<textarea value={text} maxLength={800} required onChange={e=>setText(e.target.value)} placeholder="Wat heb je gedaan en wat gebeurde er?"/></label>
        <button className="button button-primary" disabled={!text.trim()}>Verslag inleveren</button>
      </form>}
    {m.trialFeedback&&<div className="trial-note"><b>Feedback van je spelleider · {m.status==='won'?'+':'−'}{m.status==='won'?m.plus:m.minus} XP</b><p>{m.trialFeedback}</p></div>}
  </article>;
}

function PlayStyle({trial,dispatch,onClose}) {
  const [values,setValues]=useState(()=>preferences.map((_,i)=>trial.preferences[i]??null)),[shared,setShared]=useState(trial.shared);
  return <form className="panel standard-form trial-form" onSubmit={e=>{e.preventDefault();dispatch({type:'trial-style',values,shared});onClose();}}>
    <h2>Hoe speel je het liefst?</h2>
    {preferences.map((axis,i)=><label key={axis.name}>{axis.name}<select value={values[i]??''} onChange={e=>setValues(values.map((v,j)=>j!==i?v:e.target.value===''?null:Number(e.target.value)))}>
      <option value="">Wisselt per situatie</option>{axis.choices.map((choice,j)=><option key={choice} value={j}>{choice}</option>)}</select></label>)}
    <label className="trial-check"><input type="checkbox" checked={shared} onChange={e=>setShared(e.target.checked)}/>Deel deze voorkeuren met de spelleider</label>
    <div className="trial-actions"><button className="button button-primary">Speelstijl bewaren</button><button type="button" className="button button-secondary" onClick={onClose}>Annuleren</button></div>
  </form>;
}

function Goal({p,dispatch}) {
  const [editing,setEditing]=useState(false),[draft,setDraft]=useState('');
  if(editing) return <form className="panel standard-form" onSubmit={e=>{e.preventDefault();dispatch({type:'trial-goal',goal:draft});setEditing(false);}}>
    <label>Mijn persoonlijke doel<input value={draft} required maxLength={180} onChange={e=>setDraft(e.target.value)}/></label>
    <div className="trial-actions"><button className="button button-primary" disabled={!draft.trim()}>Doel bewaren</button><button type="button" className="button button-secondary" onClick={()=>setEditing(false)}>Annuleren</button></div></form>;
  return <section className="panel"><div className="section-kicker"><Icon name="target"/> MIJN DOEL</div><h2>{p.goal||'Kies waar je in wilt groeien'}</h2><button className="text-button" onClick={()=>{setDraft(p.goal);setEditing(true);}}>Doel aanpassen</button></section>;
}

export function PlayerRoom({state, dispatch, portrait}) {
  const {trial}=state;
  const player=state.players.find(p=>p.id===trial.id);
  const house=houses[trial.house];
  const missions=state.missions.filter(m=>m.player===player.id);
  const hasPersonalMission=missions.some(m=>m.firstTrial);
  const [styleOpen,setStyleOpen]=useState(false);
  const [quizOpen,setQuizOpen]=useState(false);
  const tips=preferences.map((axis,i)=>axis.tips[trial.preferences[i]]).filter(Boolean);

  return <div className="trial-room" style={{'--house':house?.color||'#ae96f4'}}>
    <section className="trial-hero">
      {portrait}
      <div className="trial-hero-copy">
        <div className="section-kicker"><Icon name={house?.icon||'shield'}/>{house?'HUIS '+house.name.toUpperCase():'HET GILDE · PROEFSPELER'}</div>
        <h1>{house?house.room:`Welkom, ${player.name}`}<span>.</span></h1>
        <p>{house?house.description:'Hier vind je jouw opdrachten en de feedback van je spelleider.'}</p>
        <div className="trial-byline">{player.name}<span>·</span>Level {levelInfo(player.score).level}<span>·</span>{player.score} XP</div>
      </div>
    </section>
    <div className="trial-layout">
      <section className="trial-stack">
        <h2>Mijn missies</h2>
        {missions.map(m=><PlayerMission key={m.id} mission={m} dispatch={dispatch}/>)}
        {!missions.length&&<p>Je spelleider kan je een missie toewijzen via je proefprofiel.</p>}
      </section>
      <aside className="trial-stack" aria-label="Mijn gildeprofiel">
        {!house&&<section className="panel">
          <div className="section-kicker"><Icon name="compass"/> GILDEPROEF</div>
          <h2>Ontdek je huis</h2>
          <p>Vier keuzes bepalen welk gildehuis bij je past.</p>
          <button className="text-button" onClick={()=>setQuizOpen(!quizOpen)} aria-expanded={quizOpen}>
            {quizOpen?'Gildeproef inklappen':trial.answers.length?'Ga verder met de gildeproef':'Start de gildeproef'}
          </button>
        </section>}
        {!house&&quizOpen&&<GuildQuiz trial={trial} dispatch={dispatch}/>}
        {house&&!hasPersonalMission&&<FirstMission player={player} house={house} dispatch={dispatch}/>}
        {house&&hasPersonalMission&&<Goal p={player} dispatch={dispatch}/>}
        {house&&(styleOpen ? <PlayStyle trial={trial} dispatch={dispatch} onClose={()=>setStyleOpen(false)}/> :
          <section className="panel">
            <div className="section-kicker"><Icon name="compass"/> MIJN SPEELSTIJL</div><h2>Wat helpt jou?</h2>
            {tips.length ? <ul>{tips.map(tip=><li key={tip}>{tip}</li>)}</ul> : <p>Kies hoe je het liefst een nieuwe opdracht aanpakt.</p>}
            <button className="text-button" onClick={()=>setStyleOpen(true)}>{tips.length?'Speelstijl aanpassen':'Verken mijn speelstijl'}</button>
          </section>)}
      </aside>
    </div>
  </div>;
}
