import React from 'react';
import Icon from '../../components/icon';

export default ({name, selected}) => (
  <div className="menu pane">
    <h2><a href="#"><Icon of="sun-o" /></a><a href="/spirits/{name}">{name}</a></h2>
    <ul>
      <li className={selected == 'status' ? 'selected' : ''}>
        <a href={`/spirit/${name}/`}><Icon of="info" />Status</a>
      </li>
      <li className={selected == 'settings' ? 'selected' : ''}>
        <a href={`/spirit/${name}/settings`}><Icon of="gear" />Spirit settings</a>
      </li>
      <li className={selected == 'config' ? 'selected' : ''}>
        <a href={`/spirit/${name}/configure`}><Icon of="wrench" />Container config</a>
      </li>
      <li className={selected == 'lives' ? 'selected' : ''}>
        <a href={`/spirit/${name}/lives`}><Icon of="history" />Lives</a>
      </li>
    </ul>
  </div>
);