import React from 'react';
import Icon from './Icon.jsx';
import {ARCHETYPES, levelInfo, statsFor} from './model.js';

export function Portrait({player, small=false, className=''}) {
  const art=ARCHETYPES[player.portrait] || ARCHETYPES.nova;
  return <div className={`portrait portrait--${art.className} ${small?'portrait-small':''} ${className}`}
    role="img" aria-label={`Avatar van ${player.name}`} style={{'--character-color':art.color}}>
    {player.image&&<img src={player.image} alt=""/>}
  </div>;
}

export function XPBar({player, compact=false}) {
  const {level,progress,remaining}=levelInfo(player.score);
  return <div className={`xp-block ${compact?'xp-compact':''}`}>
    <div className="xp-label"><span><Icon name="bolt"/> <b>{player.score}</b> XP</span><small>Level {level} <span>→</span> {level+1}</small></div>
    <div className="xp-track" role="meter" aria-label={`Level ${level}, voortgang naar level ${level+1}`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <i style={{width:`${progress}%`}}/>
    </div>
    {!compact&&<p>{remaining} XP tot level {level+1}</p>}
  </div>;
}

export function ProfileHeader({player, state, house, own=false, children}) {
  const art=ARCHETYPES[player.portrait] || ARCHETYPES.nova;
  const stats=statsFor(state,player.id);
  const npc=player.type==='npc';
  return <section className="identity-card" aria-labelledby="identity-name" style={{'--character-color':house?.color || art.color}}>
    <div className="identity-art">
      <Portrait player={player}/>
      <span className={`alignment ${npc?'evil':''}`}><i/>{npc?'FICTIEVE NPC':'GILDELID'}</span>
      <div className="identity-emblem"><Icon name={art.symbol}/><span>{art.name}</span></div>
    </div>
    <div className="profile-intro identity-copy">
      <div className="identity-role"><span aria-hidden="true">{player.avatar||'✦'}</span>{player.role}{house&&<span className="identity-house">Huis {house.name}</span>}</div>
      <h1 id="identity-name">{player.name}</h1>
      {player.bio&&<p className="identity-bio">{player.bio}</p>}
      {player.traits.length>0&&<div className="trait-list" aria-label="Sterke kanten">{player.traits.map(t=><span key={t}>{t}</span>)}</div>}
      <div className="identity-goal"><Icon name="target"/><div>
        <h2>{own?'Mijn persoonlijke doel':npc?'Doel van dit personage':'Persoonlijk doel'}</h2>
        <p>{player.goal || (own?'Welk doel wil je oefenen? Vul het in bij Profiel bewerken.':'Er is nog geen doel gekozen.')}</p>
      </div></div>
      <div className="profile-actions">{children}</div>
    </div>
    <section className="identity-progress" aria-label="Spelervoortgang">
      <div className="identity-level"><Icon name="shield"/><span>Level <strong>{levelInfo(player.score).level}</strong></span></div>
      <div className="profile-xp"><XPBar player={player}/></div>
      <dl className="identity-counts"><div><dt>Open missies</dt><dd>{stats.open}</dd></div><div><dt>Behaald</dt><dd>{stats.won}</dd></div><div><dt>Toegewezen</dt><dd>{stats.total}</dd></div></dl>
    </section>
  </section>;
}

export function ProfileMissions({missions, own=false, children}) {
  const available=missions.filter(m=>m.status==='open'&&!m.trialReport);
  const submitted=missions.filter(m=>m.status==='open'&&m.trialReport);
  const finished=missions.filter(m=>m.status!=='open');
  const groups=own
    ? [['Klaar om te spelen',available],['Ingeleverd',submitted]]
    : [['Te beoordelen',submitted],['Actieve missies',available]];
  return <div className="profile-missions">
    {[...groups,['Afgerond',finished]].filter(([,items])=>items.length>0).map(([title,items])=>
      <section className="mission-group" key={title} aria-label={title}>
        <h3 className="mission-group-title">{title} <span>{items.length}</span></h3>
        {items.map(children)}
      </section>
    )}
  </div>;
}
