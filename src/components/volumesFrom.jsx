import React from 'react';
import Icon from './icon';

export default ({config}) => (
  <section data-viewmodel="spirit/VolumesFromVM" data-model={JSON.stringify(config)} className="box">
    <h3>
      <span>
        <Icon of="tag" />
        Volumes From</span>
      <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:add" title="Add volumes from another spirit"><Icon of="plus" /></button>
    </h3>
    <div data-bind="foreach: volumesFromList" className="box-list">
      <div className="box-list-item">
        <label className="small-label" data-bind="text:fromSpirit"></label>
        <div className="box-list-item-show" data-bind="visible:state()=='show'" style={{display:'none'}}>
          <span className="button-like">
            <Icon of="lock" title="read only" data-bind="visible: readOnly" />
            <Icon of="pencil-square-o" title="read only" data-bind="visible: !readOnly()" />
          </span>
          <span className="control-like text-muted" data-bind="text:volumes, click:edit"></span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Change which spirit to use volumes from"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="if:state()=='editing', visible:state()=='editing', submit:save" style={{display:'none'}}>
          <button className="pure-button" title="read only" data-bind="click: toggleReadOnly">
            <Icon of="" data-bind="css:{'fa-lock':readOnly, 'fa-pencil-square-o':!readOnly()}" />
          </button>
          <select data-bind="value:fromSpirit, hasFocus:state()=='editing', options: $parent.availableSpirits"></select>
          <button className="pure-button button-success" type="submit" data-bind="click:save"><Icon of="check" /></button>
          <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
          <button className="pure-button button-error" data-bind="click:$parent.remove"><Icon of="trash" /></button>
        </form>
      </div>
    </div>
    <div data-bind="ifnot:volumesFromList().length" className="box-list">
      <div className="box-form box-list-item">
        <p className="text-center text-muted">Click the pluss icon above to use the volumes from another spirit</p>
      </div>
    </div>
    <form className="box-form pure-form pure-form-stacked" data-bind="visible:creating, submit:create, disable:create.isBusy" style={{display:'none'}}>
      <label className="small-label">From spirit <span className="validation-error-message" data-bind="validationMessageFor:fresh.fromSpirit"></span></label>
      <select data-bind="value:fresh.fromSpirit, options: freshAvailableSpirits, hasFocus: creating()"></select>

      <label className="pure-checkbox">
        <span className="button-like">
          <Icon of="lock" title="read only" data-bind="visible: fresh.readOnly" />
          <Icon of="pencil-square-o" title="read only" data-bind="visible: !fresh.readOnly()" />
        </span>
        <input type="checkbox" data-bind="checked: fresh.readOnly" />
        Read only
      </label>

      <div className="button-group">
        <button className="pure-button button-success" type="submit" data-bind="click:create"><Icon of="check" /> Create</button>
        <button className="pure-button" type="cancel" data-bind="click:cancelCreate"><Icon of="close" /> Cancel</button>
      </div>
    </form>
  </section>
);