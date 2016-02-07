import React from 'react';

export default ({
  selected = ''
}={}) => (
  <div className="menu pane">
    <h2><a href="#"><i className="fa fa-bars fa-fw"></i></a><a href="/">Menu</a></h2>
    <ul>
      <li className={selected === 'constellations' ? 'selected' : ''}>
        <a href="#">
          <i className="fa fa-share-alt fa-rotate-90 fa-fw"></i>Constellations
        </a>
      </li>

      <li className={selected === 'spirits' ? 'selected' : ''}>
        <a href="/spirits">
          <i className="fa fa-sun-o fa-fw"></i>Spirits
        </a>
      </li>

      <li className={selected === 'containers' ? 'selected' : ''}>
        <a href="/containers">
          <i className="fa fa-th-large fa-fw"></i>Containers
        </a>
      </li>

      <li className={selected === 'settings' ? 'selected' : ''}>
        <a href="/settings">
          <i className="fa fa-cog fa-fw"></i>Settings
        </a>
      </li>

      <li className="list-item-bottom">
        <a href="/logout">
          <i className="fa fa-sign-out fa-fw"></i>Log out
        </a>
      </li>
    </ul>
  </div>);
