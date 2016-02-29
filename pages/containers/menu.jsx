import React from 'react';
import Icon from '../../components/icon';

export default ({containers}) => (
  <div className="pane menu">
    <h2><a href="#"><i className="fa fa-th-large fa-fw"></i></a><a href="/containers">Containers</a></h2>
    <ul>
      {containers.map(container => (
        <li data-viewmodel="MenuListContainerVM"
            data-model={JSON.stringify(container)}
            key={container.id}
            className={container.selected ? 'selected' : ''}>
          <a href={`/container/${container.id}`}>
            <i className="container-state fa fa-{stateIcon} fa-fw"
            data-bind="css:{
              'fa-play':running,
              'fa-stop': stopped,
              'fa-pause': paused,
              'fa-spinner': busy,
              'fa-spin': busy
            }"></i>
            {container.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
