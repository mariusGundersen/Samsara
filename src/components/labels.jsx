import React from 'react';
import Icon from './icon';

export default ({config, url}) => (
  <section data-viewmodel="spirit/LabelsVM" data-model={JSON.stringify(config)} className="box">
    <h3>
      <span>
        <Icon of="tag" />
        Labels
      </span>
      <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:add" title="Add label"><Icon of="plus" /></button>
    </h3>
    <div data-bind="foreach: labels" className="box-list">
      <div className="box-list-item">
        <label className="small-label" data-bind="text:key"></label>
        <div className="box-list-item-show" data-bind="visible:state()=='show'" style={{display:'none'}}>
          <span className="control-like" data-bind="text:value, click:edit"></span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Edit label"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="visible:state()=='editing', submit:save" style={{display:'none'}}>
          <input value="" data-bind="value:value, hasFocus:state()=='editing'" placeholder="value" />
          <button className="pure-button button-success" type="submit" data-bind="click:save"><Icon of="check" /></button>
          <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
          <button className="pure-button button-error" data-bind="click:$parent.remove"><Icon of="trash" /></button>
        </form>
      </div>
    </div>
    <div data-bind="ifnot:labels().length" className="box-list">
      <div className="box-form box-list-item">
        <p className="text-center text-muted">Click the pluss icon above to add a new label</p>
      </div>
    </div>
    <form className="box-form pure-form pure-form-stacked" data-bind="visible:creating, submit:create, disable:create.isBusy" style={{display:'none'}}>
      <label className="small-label">Key <span className="validation-error-message" data-bind="validationMessageFor:fresh.key"></span></label>
      <input value="" data-bind="value:fresh.key, hasFocus:creating()" placeholder="label key" />

      <label className="small-label">Value</label>
      <input value="" data-bind="value:fresh.value" placeholder="value" />

      <div className="button-group">
        <button className="pure-button button-success" type="submit" data-bind="click:create"><Icon of="check" /> Create</button>
        <button className="pure-button" type="cancel" data-bind="click:cancelCreate"><Icon of="close" />&nbsp;Cancel</button>
      </div>
    </form>
  </section>
);