import React from 'react';
import Icon from '../../components/icon';
import DeployProgress from '../../components/deployProgress';
import Logs from '../../components/logs';
import nth from '../../private/nthLife';

export default ({name, life, revive, deploy, logs}) => (
  <div className="pane content">
    <h2>{nth(life)} life of {name}</h2>
    <div className="grid-container">

      {revive.revivable ? (
        <div className="box" data-viewmodel="spirit/life/ReviveVM" data-model={JSON.stringify(revive)}>
          <h3>Revive</h3>
          <div className="text-center" style={{padding: '1em'}}>
            <div className="button-group">
                <button className="pure-button" data-bind="click: revive, disable: revive.isBusy">
                  <Icon of="play" className="container-state" data-bind="spinIcon: revive.isBusy" /> Revive {nth(revive.life)} life
                </button>
            </div>
            <span className="validation-error-message text-center" data-bind="validationMessageFor: revive"></span>
          </div>
          <DeployProgress deploy={deploy} />
        </div>
      ) : ''}

      <Logs model={logs} />
    </div>
  </div>
);
