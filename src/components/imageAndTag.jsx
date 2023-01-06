import Icon from "./icon.js";

export default props => (
  <div className="box-form" style={{padding:0}} data-viewmodel="spirit/ImageAndTagVM" data-params="image:image, tag:tag">
    <label className="small-label">Image <span className="validation-error-message" data-bind="validationMessageFor:image"></span></label>
    <input data-bind="textInput: image, hasFocus:imageHasFocus, css:{'autocomplete-input-focus':imageHasFocus}" className="autocomplete-input" placeholder="ex: nginx" />
    <div className="autocomplete-list" data-bind="visible: imageHasFocus" style={{display:'none'}}>
      <ul className="pure-menu-list" data-bind="foreach: images">
        <li className="pure-menu-item">
          <a href="#" className="pure-menu-link" data-bind="text: name, click: $parent.selectImage, hasFocus: focus"></a>
        </li>
      </ul>
      <div data-bind="visible: search.isBusy" style={{display:'none', padding: '.5em 1em'}} className="text-muted">
        <Icon of="refresh" spin={true} /> Searching...
      </div>
    </div>

    <label className="small-label">Tags <span className="validation-error-message" data-bind="validationMessageFor:tag, visible: tags().length"></span></label>
    <select data-bind="options: tags,
                      optionsValue: 'name',
                      optionsText: 'name',
                      value: tag,
                      valueAllowUnset: true,
                      hasFocus: tagHasFocus,
                      optionsCaption: tags().length ? 'Choose tag...' : 'Unknown image'">
      <option>Unknown image</option>
    </select>
  </div>
);