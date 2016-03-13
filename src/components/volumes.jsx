import React from 'react';
import Icon from './icon';

export default ({config}) => (
  <section data-viewmodel="spirit/VolumesVM" data-model={JSON.stringify(config)} className="box">
    <h3>
      <span>
        <Icon of="database" />
        Volumes
      </span>
      <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:add" title="Add new volume"><Icon of="plus" /></button>
    </h3>
    <div data-bind="foreach: volumes" className="box-list">
      <div className="box-list-item">
        <label className="small-label" data-bind="text:containerPath"></label>
        <div className="box-list-item-show" data-bind="visible:state()=='show', click:edit" style={{display: 'none'}}>
          <span className="button-like">
            <Icon of="lock" title="read only" data-bind="visible: readOnly" />
            <Icon of="pencil-square-o" title="read only" data-bind="visible: !readOnly()" />
          </span>
          <span className="control-like" data-bind="text:hostPath"></span>
          <span className="control-like text-muted" data-bind="ifnot:hostPath">(docker)</span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Edit variable"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="visible:state()=='editing', submit:save" style={{display: 'none'}}>
          <button type="button" className="pure-button" title="read only" data-bind="click: toggleReadOnly">
            <Icon of="" data-bind="css:{'fa-lock':readOnly, 'fa-pencil-square-o':!readOnly()}" />
          </button>
          <input data-bind="value:hostPath, hasFocus:state()=='editing'" placeholder="Path on host (optional)" />
          <button type="submit" className="pure-button button-success" data-bind="click:save"><Icon of="check" /></button>
          <button type="cancel" className="pure-button" data-bind="click:cancel"><Icon of="close" /></button>
          <button type="button" className="pure-button button-error" data-bind="click:$parent.remove"><Icon of="trash" /></button>
        </form>
      </div>
    </div>
    <div data-bind="ifnot:volumes().length" className="box-list">
      <div className="box-form box-list-item">
        <p className="text-center text-muted">Click the pluss icon above to add a new volume</p>
      </div>
    </div>
    <form class="box-form pure-form pure-form-stacked" data-bind="visible:creating, submit:create, disable:create.isBusy" style={{display: 'none'}}>
      <label class="small-label">Container path <span class="validation-error-message" data-bind="validationMessageFor:fresh.containerPath"></span></label>
      <input value="" data-bind="value:fresh.containerPath, hasFocus: creating()" placeholder="path inside container" />

      <label class="small-label">Host path</label>
      <input value="" data-bind="value:fresh.hostPath" placeholder="path on host (optional)" />
      <label class="pure-checkbox">
        <span class="button-like">
          <Icon of="lock" title="read only" data-bind="visible: fresh.readOnly" />
          <Icon of="pencil-square-o" title="read only" data-bind="visible: !fresh.readOnly()" />
        </span>
        <input type="checkbox" data-bind="checked: fresh.readOnly" />
        Read only
      </label>

      <div class="button-group">
        <button class="pure-button button-success" type="submit" data-bind="click:create"><Icon of="check" /> Create</button>
        <button class="pure-button" type="cancel" data-bind="click:cancelCreate"><Icon of="close" /> Cancel</button>
      </div>

    </form>
  </section>
);