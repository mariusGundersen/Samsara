import React from 'react';
import Icon from '../../components/icon';
import ImageAndTag from '../../components/imageAndTag';
import {appendSuffix} from 'nth';

export default ({spirits}) => (
  <div className="pane content">
    <h2>Spirits</h2>
    <ul className="pure-menu-list">
      {spirits.map(spirit => (
        <li className="pure-menu-item">
          <a href={`/spirit/${spirit.name}`} className="pure-menu-link">{spirit.name} <span className="text-faded">({nth(spirit.life)} life)</span></a>
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