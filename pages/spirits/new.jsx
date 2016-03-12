import React from 'react';
import Icon from '../../components/icon';
import ImageAndTag from '../../components/imageAndTag';

export default ({spirits, newSelected}) => (
  <div className="pane content">
    <h2>New spirit</h2>
    <div className="grid-container">
      <section className="box" data-viewmodel="NewSpiritVM">
        <form className="pure-form pure-form-stacked box-form" data-bind="submit: create">
          <label className="small-label">Name&nbsp;<span className="validation-error-message" data-bind="validationMessageFor:name"></span></label>
          <input data-bind="value: name" placeholder="ex: website" autoFocus />

          <ImageAndTag />

          <div className="button-group">
            <button type="submit" className="pure-button button-success" data-bind="disable: create.isBusy">
              <Icon of="check" data-bind="spinIcon: create.isBusy" />
              Create
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
);
