import Icon from "./icon.js";

export default ({settings }) => (
  <section data-viewmodel="spirit/WebhookVM" data-model={JSON.stringify(settings)} className="box">
    <div data-bind="visible: enabled" style={{display:settings.webhook.enable?'block':'none'}}>
      <h3>
        <span>
          <Icon of="anchor" />
          Webhook
        </span>
        <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:edit" title="Edit webhook"><Icon of="pencil" /></button>
      </h3>
      <form className="box-form pure-form pure-form-stacked">
        <label className="small-label" for="url">Webhook url</label>
        <input id="url" readonly data-bind="value: url" value={`http://example.com/deploy/${settings.name}/${settings.webhook.secret}`} />
        <label className="small-label">Match tag</label>
        <span className="control-like" data-bind="text: matchTag">{settings.webhook.matchTag}</span>
      </form>
    </div>

    <div data-bind="visible: editing" style={{display:'none'}}>
      <h3>
        <span>
          <Icon of="anchor" />
          Webhook
        </span>
        <button className="pure-button button-xsmall button-minimal button-no-padding" data-bind="click:cancel" title="Cancel changes"><Icon of="undo" /></button>
      </h3>
      <form className="pure-form pure-form-stacked box-form" data-bind="submit: save">
        <label className="small-label" for="secret">Secret</label>
        <input id="secret" data-bind="value: secret" className="pure-input-1-2" />
        <label className="small-label" for="matchTag">Match tag</label>
        <input id="matchTag" data-bind="value: matchTag" className="pure-input-1-2" placeholder="e.g. 'latest' or '~1.0.0'" />

        <div className="button-group">
          <button className="pure-button button-success" type="submit" data-bind="click: save"><Icon of="check" /> Save</button>
          <button className="pure-button" type="cancel" data-bind="click: cancel"><Icon of="undo" /> Cancel</button>
          <button className="pure-button button-error" data-bind="click:disable"><Icon of="close" /> Disable</button>
        </div>
      </form>
    </div>

    <div data-bind="visible: disabled" style={{display:settings.webhook.enable?'none':'block'}}>
      <h3>
        <span>
          <Icon of="anchor" />
          Webhook
        </span>
      </h3>
      <form className="pure-form box-form pure-form-stacked">
        <p className="text-center">By enabling the webhook the Docker Hub can automatically deploy the latest version of the container</p>
        <span className="pure-u-1-4"></span>
        <button className="pure-button pure-button-primary button-xlarge pure-input-1-2" data-bind="click:enable"><Icon of="anchor" /> Enable</button>
      </form>
    </div>
  </section>
);