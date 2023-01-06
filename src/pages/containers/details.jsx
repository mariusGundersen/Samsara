import Icon from "../../components/icon.js";

export default (content) => (
  <div data-viewmodel="ContainerViewModel" data-model={JSON.stringify(content.controls)} className="pane content">
    <h2>{content.name}</h2>
    <div className="grid-container">
      <div className="box">
        <h3>Controls</h3>
        <div className="text-center" style={{padding: "1em"}}>
          <div className="button-group">
            <button className="pure-button"
                    data-bind="click: start, disable:running()||isBusy()"
                    disabled={content.controls.running}>
              <Icon of="play" colored={true} data-bind="spinIcon: start.isBusy" />
              Start
            </button>
            <button className="pure-button"
                    data-bind="click: restart, disable: !running()||isBusy()"
                    disabled={!content.controls.running}>
              <Icon of="refresh" colored={true} data-bind="spinIcon: restart.isBusy" />
              Restart
            </button>
            <button className="pure-button"
                    data-bind="click: stop, disable: !running()||isBusy()"
                    disabled={!content.controls.running}>
              <Icon of="stop" colored={true} data-bind="spinIcon: stop.isBusy" />
              Stop
            </button>
          </div>
        </div>
      </div>

      <div className="box">
        <h3>Remove container</h3>
        <div className="text-center" style={{padding: "1em"}}>
          <button className="pure-button button-error"
                  data-bind="click: remove, disable: running()||isBusy()"
                  disabled={!content.controls.running}>
            <Icon of="trash-o" data-bind="spinIcon: remove.isBusy" />
            Remove
          </button>
        </div>
      </div>

      <div className="box">
        <h3>Convert to spirit</h3>
        <div className="text-center" style={{padding: "1em"}}>
          <button className="pure-button pure-button-primary button-xlarge"
                  data-bind="click: toSpirit, disable: isBusy">
            <Icon of="sun-o" data-bind="spinIcon: toSpirit.isBusy" />
            Create Spirit
          </button>
        </div>
      </div>

      <div className="box box-large box-no-scroll">
        <div className="box-header box-tabs">
          <a data-bind="selectable: tab, name:'logs'" selected href="#" className="box-tab">Logs</a>
          <a data-bind="selectable: tab, name:'json'" href="#" className="box-tab">Inspect</a>
        </div>
        <div data-bind="ifSelected: tab, name: 'logs'" style={{position: "relative"}}>
          <pre className="logs" dangerouslySetInnerHTML={content.log}>
          </pre>
          <div className="button-group logs-buttons">
            <a href={`${content.controls.id}/logs/download`} className="pure-button download-logs-button">
              <Icon of="download" />
            </a>
          </div>
        </div>

        <pre className="logs" data-bind="ifSelected: tab, name: 'json'" style={{display: "none"}}>{content.json}</pre>
      </div>
    </div>
  </div>
);
