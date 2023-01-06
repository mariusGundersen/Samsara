import Icon from "./icon.js";

export default ({model}) => (
  <div className="box box-large box-no-scroll" data-viewmodel="spirit/life/LogsVM">
    <div className="box-header box-tabs">
      <a data-bind="selectable: tab, name:'logs'" href="#" className="box-tab" selected>Logs</a>
      <a data-bind="selectable: tab, name:'json'" href="#" className="box-tab">Inspect</a>
      <a data-bind="selectable: tab, name:'config'" href="#" className="box-tab">Configuration</a>
      <a data-bind="selectable: tab, name:'deploy'" href="#" className="box-tab">Deploy log</a>
    </div>
    <div data-bind="ifSelected: tab, name: 'logs'" style={{position:'relative'}}>
      <div data-viewmodel="spirit/life/LifeLogVM" data-model={JSON.stringify(model.lifeLog)}>
        <pre className="logs full-page" data-bind="visible: log().length == 0" dangerouslySetInnerHTML={model.log}>
        </pre>
        <pre className="logs full-page" data-bind="visible: log().length > 0, foreach: log, followProgress: log" style={{display:'none'}}>
          <span data-bind="html:$data"></span>
        </pre>
        <div className="button-group logs-buttons">
          <a href={`/spirits/${model.name}/life/${model.life}/logs/download`} className="pure-button">
            <Icon of="download" />
          </a>
          <button className="pure-button" data-bind="click: toggleFollowLogs">
            <Icon of="play" data-bind="visible: !isFollowing()" />
            <Icon of="pause" data-bind="visible: isFollowing()" style={{display:'none'}} />
          </button>
        </div>
      </div>
    </div>

    <pre className="logs full-page" data-bind="ifSelected: tab, name: 'json'" style={{display:'none'}}>{model.json}</pre>

    <pre className="logs full-page" data-bind="ifSelected: tab, name: 'config'" style={{display:'none'}}>{model.config}</pre>

    <pre className="logs full-page" data-bind="ifSelected: tab, name: 'deploy'" style={{display:'none'}}>{model.deploy}</pre>
  </div>
);