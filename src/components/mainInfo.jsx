import React from 'react';
import Icon from './icon';

export default ({settings}) => (
  <section data-viewmodel="spirit/MainInfoVM" data-model={JSON.stringify(settings)} className="box">
    <h3>
      <span>
        <Icon of="info" />
        Main info
      </span>
    </h3>
    <div className="box-list">
      <div className="box-list-item" data-bind="with:description">
        <label className="small-label">Description</label>
        <div className="box-list-item-show" data-bind="visible:!editing(), click:edit">
          <span className="control-like" data-bind="text:value">{settings.description}</span>
          <span className="text-muted control-like" data-bind="visible:!value()" style={{display:settings.description?'none':'inline'}}>(not set)</span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Change description"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="visible:editing, submit:save" style={{display:'none'}}>
          <input data-bind="value:value, hasFocus:editing()" />
          <button className="pure-button button-success" type="submit" data-bind="click:save"><Icon of="check" /></button>
          <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
        </form>
      </div>

      <div className="box-list-item" data-bind="with:url">
        <label className="small-label">Website</label>
        <div className="box-list-item-show" data-bind="visible:!editing(), click:edit">
          <a className="control-like" href="{settings.url}" data-bind="text:value, attr:{href:value}, click: function(){return true}, clickBubble:false" target="_blank">{settings.url}</a>
          <span className="text-muted control-like" data-bind="visible:!value()" style={{display:settings.url?'none':'inline'}}>(not set)</span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Change website url"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="visible:editing, submit:save" style={{display:'none'}}>
          <input data-bind="value:value, hasFocus:editing()" placeholder="http://" />
          <button className="pure-button button-success" type="submit" data-bind="click:save"><Icon of="check" /></button>
          <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
        </form>
      </div>

      <div className="box-list-item" data-bind="with:deploymentMethod">
        <label className="small-label">Deployment</label>
        <div className="box-list-item-show" data-bind="visible:!editing(), click:edit">
          <span className="control-like" data-bind="text:value">{settings.deploymentMethod}</span>
          <span className="text-muted control-like" data-bind="visible:!value()" style={{display:settings.deploymentMethod?'none':'inline'}}>(not set)</span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Change deployment method"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="visible:editing, submit:save" style={{display:'none'}}>
          <select data-bind="value:value, hasFocus:editing()">
            <option value="start-before-stop">start-before-stop (zero downtime)</option>
            <option value="stop-before-start">stop-before-start (stop during deploy)</option>
          </select>
          <button className="pure-button button-success" type="submit" data-bind="click:save"><Icon of="check" /></button>
          <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
        </form>
      </div>

      <div className="box-list-item" data-bind="with:cleanupLimit">
        <label className="small-label">Rollback history</label>
        <div className="box-list-item-show" data-bind="visible:!editing(), click:edit">
          <span className="control-like" data-bind="text:value, visible: value">{settings.cleanupLimit}</span>
          <span className="control-like" data-bind="visible:!value()" style={{display:settings.cleanupLimit?'none':'inline'}}>Forever</span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Change the number of containers to retain. A value of 0 means infinite"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="visible:editing, submit:save" style={{display:'none'}}>
          <input type="number" min="0" data-bind="value:value, hasFocus:editing()" />
          <button className="pure-button button-success" type="submit" data-bind="click:save"><Icon of="check" /></button>
          <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
        </form>
      </div>
    </div>
  </section>
);