import React from 'react';
import Icon from '../../components/icon';
import {appendSuffix} from 'nth';

export default ({spirits, newSelected, selectedSpiritName}) => (
  <div className="menu pane">
    <h2><a href="#"><Icon of="sun-o" /></a><a href="/spirits">Spirits</a></h2>
    <ul>
      <li className={newSelected ? 'selected' : ''}>
        <a href="/spirit/new"><Icon of="plus" />Create new spirit</a>
      </li>
      {spirits.map(spirit => (
        <li className={spirit.name == selectedSpiritName ? 'selected' : ''} key={spirit.name}>
          <a href={`/spirit/${spirit.name}`}>
            <Icon of={getIcon(spirit.state)} className="container-state" />
            {spirit.name} <span className="container-life">({nth(spirit.life)} life)</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

function nth(value){
  try{
    return appendSuffix(value);
  }catch(e){
    return 'no';
  }
}

function getIcon(state){
  switch(state){
    case 'running': return 'play';
    case 'paused': return 'pause';
    case 'exited': return 'stop';
    case 'restarting': return 'spinner fa-spin';
    case 'deploying': return 'spinner fa-spin';
    default: return 'stop'
  }
}
