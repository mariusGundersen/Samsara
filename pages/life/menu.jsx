import React from 'react';
import Icon from '../../components/icon';
import {appendSuffix} from 'nth';

export default ({name, lives, selectedLife}) => (
  <div className="menu pane">
    <h2><a href="#"><Icon of="history" /></a><a href={`/spirit/${name}/lives`}>Lives</a></h2>
    <ul className="life-list">
      {lives.map(life => (
        <li className={`state-${getStatus(life.state)} ${life.life == selectedLife ? 'selected' : ''}`} key={life.life}>
          <a href={`/spirit/${name}/life/${life.life}`}>
              {nth(life.life)} - {life.uptime}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

function nth(n){
  try{
    return appendSuffix(n);
  }catch(e){
    return 'no';
  }
}

function getStatus(state){
  switch(state){
    case 'running': return 'active';
    case 'restarting': return 'active';
    default: return 'dead';
  }
}
