import React from 'react';
import Icon from '../../components/icon';

export default ({
  selected = ''
}={}) => (
  <div className="menu pane">
    <h2><a href="#"><Icon of="bars" /></a><a href="/">Menu</a></h2>
    <ul>
      <li className={selected === 'constellations' ? 'selected' : ''}>
        <a href="#">
          <Icon of="share-alt" rotate="90" />Constellations
        </a>
      </li>

      <li className={selected === 'spirits' ? 'selected' : ''}>
        <a href="/spirits">
          <Icon of="sun-o" />Spirits
        </a>
      </li>

      <li className={selected === 'containers' ? 'selected' : ''}>
        <a href="/containers">
          <Icon of="th-large" />Containers
        </a>
      </li>

      <li className={selected === 'settings' ? 'selected' : ''}>
        <a href="/settings">
          <Icon of="cog" />Settings
        </a>
      </li>

      <li className="list-item-bottom">
        <a href="/logout">
          <Icon of="sign-out" />Log out
        </a>
      </li>
    </ul>
  </div>);
