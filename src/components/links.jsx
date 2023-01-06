import Icon from "./icon.js";

export default ({config}) => (
  <section data-viewmodel="spirit/LinksVM" data-model={JSON.stringify(config)} className="box">
    <h3>
      <span>
        <Icon of="link" />
        Links
      </span>
      <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:add" title="Add new link"><Icon of="plus" /></button>
    </h3>
    <div data-bind="foreach: links" className="box-list">
      <div className="box-list-item">
        <label className="small-label" data-bind="text:alias"></label>
        <div className="box-list-item-show" data-bind="visible:state()=='show'" style={{display:'none'}}>
          <span className="control-like" data-bind="text:spirit, click:edit"></span>
          <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Edit link"><Icon of="pencil" /></button>
        </div>
        <form className="pure-form box-list-item-edit" data-bind="if:state()=='editing', visible:state()=='editing', submit:save" style={{display:'none'}}>
          <select data-bind="value:spirit, hasFocus:state()=='editing', options: $parent.availableSpirits"></select>
          <button className="pure-button button-success" type="submit"><Icon of="check" /></button>
          <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
          <button className="pure-button button-error" data-bind="click:$parent.remove"><Icon of="trash" /></button>
        </form>
      </div>
    </div>
    <div data-bind="ifnot:links().length" className="box-list">
      <div className="box-form box-list-item">
        <p className="text-center text-muted">Click the pluss icon above to add a new link to another spirit</p>
      </div>
    </div>
    <form className="box-form pure-form pure-form-stacked" data-bind="visible:creating, submit:create, disable:create.isBusy" style={{display:'none'}}>
      <label className="small-label">Alias <span className="validation-error-message" data-bind="validationMessageFor:fresh.alias"></span></label>
      <input value="" data-bind="value:fresh.alias, hasFocus: creating()" placeholder="name of link inside container" />

      <label className="small-label">Spirit</label>
      <select data-bind="value:fresh.spirit, options: availableSpirits"></select>

      <div className="button-group">
        <button className="pure-button button-success" type="submit" data-bind="click:create"><Icon of="check" /> Create</button>
        <button className="pure-button" type="cancel" data-bind="click:cancelCreate"><Icon of="close" /> Cancel</button>
      </div>
    </form>
  </section>
);