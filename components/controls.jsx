import React from 'react';
import Icon from './icon';

export default ({controls, url}) => (
  <section data-viewmodel="spirit/ControlsVM" data-model={JSON.stringify(controls)} className="box" style={{marginBottom: '20px'}}>
    <h3>
      <span>
        <Icon of="gears" />
        Control
      </span>
    </h3>
    <div className="text-center box-form">
      <div className="button-group">
        <button className="pure-button"
                data-bind="click: start, disable: isBusy()||!canStart()"
                disabled={!controls.canStart}>
          <Icon of="play" className="container-state" data-bind="spinIcon: start.isBusy" />
          Start
        </button>
        <button className="pure-button"
                data-bind="click: restart, disable: isBusy()||!canRestart()"
                disabled={!controls.canRestart}>
          <Icon of="refresh" data-bind="spinIcon: restart.isBusy" />
          Restart
        </button>
        <button className="pure-button"
                data-bind="click: stop, disable: isBusy()||!canStop()"
                disabled={!controls.canStop}>
          <Icon of="stop" className="container-state" data-bind="spinIcon: stop.isBusy" />
          Stop
        </button>
      </div>
      <p>
        <a href={url} target="_blank">{url}</a>
      </p>
    </div>
  </section>
);