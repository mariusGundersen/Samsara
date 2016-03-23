import React from 'react';
import Icon from './icon';

export default ({config}) => (
  <section data-viewmodel="spirit/PortsVM" data-model={JSON.stringify(config)} className="box">
    <h3>
      <span>
        <Icon of="plug" />
        Ports
      </span>
      <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:add" title="Add new port binding"><Icon of="plus" /></button>
    </h3>
    <div data-bind="foreach: ports" className="box-list">
      <div className="box-list-item">
        <label className="small-label" data-bind="text:hostPort"></label>
        <span className="validation-error-message" data-bind="validationMessageFor: containerPort"></span>
        <span className="validation-error-message" data-bind="validationMessageFor: hostIp"></span>
        <div className="box-list-item-show" data-bind="visible:state()=='show'" style={{display:'none'}}>
          <span className="control-like" data-bind="text:containerPort"></span>
          <span className="control-like" data-bind="visible:hostIp"> (<span data-bind="text:hostIp"></span>)</span>
          <span className="control-like flex-shrink" data-bind="visible:tcp"> TCP</span>
          <span className="control-like flex-shrink" data-bind="visible:udp"> UDP</span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Edit port"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="visible:state()=='editing', submit:save" style={{display:'none'}}>
          <input value="" data-bind="value:containerPort, hasFocus:state()=='editing'" placeholder="container port" />
          <input value="" data-bind="value:hostIp" placeholder="host ip (optional)" />
          <button className="pure-button" type="button" data-bind="click:toggleTcp, css: {'text-strikeout':!tcp()}">TCP</button>
          <button className="pure-button" type="button" data-bind="click:toggleUdp, css: {'text-strikeout':!udp()}">UDP</button>
          <button className="pure-button button-success" type="submit" data-bind="click:save"><Icon of="check" /></button>
          <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
          <button className="pure-button button-error" type="button" data-bind="click:$parent.remove"><Icon of="trash" /></button>
        </form>
      </div>
    </div>
    <div data-bind="ifnot:ports().length" className="box-list">
      <div className="box-form box-list-item">
        <p className="text-center text-muted">Click the pluss icon above to expose another port</p>
      </div>
    </div>
    <form className="box-form pure-form pure-form-stacked" data-bind="visible:creating, submit:create, disable:create.isBusy" style={{display:'none'}}>
      <label className="small-label">Host port <span className="validation-error-message" data-bind="validationMessageFor: fresh.hostPort"></span></label>
      <input value="" data-bind="value:fresh.hostPort, hasFocus: creating()" placeholder="for example: 80" />

      <label className="small-label">Container port <span className="validation-error-message" data-bind="validationMessageFor: fresh.containerPort"></span></label>
      <input value="" data-bind="value:fresh.containerPort" placeholder="for example: 8080" />

      <label className="small-label">Host IP (optional) <span className="validation-error-message" data-bind="validationMessageFor: fresh.hostIp"></span></label>
      <input value="" data-bind="value:fresh.hostIp" placeholder="for example: 127.0.0.1" />

      <label className="small-label"><input type="checkbox" checked data-bind="checked:fresh.tcp" /> TCP</label>
      <label className="small-label"><input type="checkbox" checked data-bind="checked:fresh.udp" /> UDP</label>

      <div className="button-group">
        <button className="pure-button button-success" type="submit" data-bind="click:create"><Icon of="check" /> Create</button>
        <button className="pure-button" type="cancel" data-bind="click:cancelCreate"><Icon of="close" /> Cancel</button>
      </div>
    </form>
  </section>
);