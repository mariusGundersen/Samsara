import React from 'react';
import Icon from '../../components/icon';
import MenuPane from '../../components/menuPane';
import {appendSuffix} from 'nth';

export default ({name, lives, selectedLife}) => (
  <MenuPane icon="history" href={`/spirit/${name}/lives`} title="Lives">
    <ul className="life-list">
      {lives.map(life => (
        <li className={`state-${getStatus(life.state)} ${life.life == selectedLife ? 'selected' : ''}`} key={life.life}>
          <a href={`/spirit/${name}/life/${life.life}`}>
              {nth(life.life)} - {life.uptime}
          </a>
        </li>
      ))}
    </ul>
  </MenuPane>
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
