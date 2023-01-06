import Icon from "./icon.js";
import ImageAndTag from "./imageAndTag.js";

export default ({config}) => (
  <section data-viewmodel="spirit/RepositoryVM" data-model={JSON.stringify(config)} className="box">
    <div data-bind="visible: editing" style={{display:'none'}}>
      <h3>
        <span>
          <Icon of="info" />
          Repository information
        </span>
        <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:cancel" title="Cancel changes"><Icon of="undo" /></button>
      </h3>
      <form className="pure-form pure-form-stacked box-form" data-bind="submit: save">
        <ImageAndTag />

        <div className="button-group">
          <button className="pure-button button-success" type="submit" data-bind="click: save"><Icon of="check" /> Save</button>
          <button className="pure-button" type="cancel" data-bind="click: cancel"><Icon of="undo" /> Cancel</button>
        </div>
      </form>
    </div>

    <div data-bind="visible: !editing()">
      <h3>
        <span>
          <Icon of="info" />
          Repository information
        </span>
        <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:edit" title="Edit container repository"><Icon of="pencil" /></button>
      </h3>
      <form className="box-form pure-form-stacked pure-form">
        <label className="small-label" for="url">Image</label>
        <a className="control-like" href="https://hub.docker.com/r/{config.image}" data-bind="text:image, attr:{href:'https://hub.docker.com/'+(image().indexOf('/')>0 ? 'r/'+image() : '_/'+image())}" target="_blank">{config.image}</a>
        <label className="small-label">Tag</label>
        <span className="control-like" href="https://hub.docker.com/r/{config.tag}" data-bind="text:tag">{config.tag}</span>
      </form>
    </div>
  </section>
);