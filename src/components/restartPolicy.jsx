import React from 'react';
import Icon from './icon';

export default ({config}) => (
  <section data-viewmodel="spirit/RestartVM" data-model={JSON.stringify(config)} className="box">
    <div data-bind="visible: editing" style={{display:'none'}}>
      <h3>
        <span>
          <Icon of="recycle" />
          Restart Policy
        </span>
        <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:cancel" title="Cancel changes"><Icon of="undo" /></button>
      </h3>
      <form className="pure-form pure-form-stacked box-form" data-bind="submit: save">
        <select data-bind="value: value">
          <option value="">Don't restart</option>
          <option value="always">Always restart</option>
          <option value="unless-stopped">Restart unless stopped</option>
          <option value="on-failure">Restart on non-zero exit code</option>
        </select>
        <div className="button-group">
          <button className="pure-button button-success" type="submit" data-bind="click: save"><Icon of="check" /> Save</button>
          <button className="pure-button" type="cancel" data-bind="click: cancel"><Icon of="undo" /> Cancel</button>
        </div>
      </form>
    </div>

    <div data-bind="visible: !editing()">
      <h3>
        <span>
          <Icon of="recycle" />
          Restart Policy
        </span>
        <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:edit" title="Edit restart policy"><Icon of="pencil" /></button>
      </h3>
      <form className="box-form pure-form-stacked pure-form">
        <label className="small-label">Restart Policy</label>
        <span className="control-like" data-bind="text: displayValue">{config.restartPolicy}</span>
      </form>
    </div>
  </section>
);