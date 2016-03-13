import React from 'react';
import Icon from './icon';

export default ({deploy}) => (
  <section className="box" data-viewmodel="spirit/DeployVM" data-model={JSON.stringify(deploy)}>
    <h3>
      <span>
        <Icon of="cloud-upload" />
        Deploy
      </span>
    </h3>
    <p className="text-center">
      Pull <code>{deploy.image}</code> from the Docker Hub and
      {deploy.stopBeforeStart
        ? 'stop the currently running container before starting a new life'
        : 'start a new container before stopping the currently running life'}
    </p>
    <div className="text-center" style={{paddingBottom: '20px'}}>
      <button
        className="pure-button pure-button-primary button-xlarge"
        data-bind="click: deploy, disable: isBusy"
        disabled={deploy.isDeploying}>
        <Icon of="cloud-upload" data-bind="spinIcon: isBusy" />
        Deploy
      </button>
    </div>
    <div data-bind="validationMessageFor: deploy" className="text-center validation-error-message"></div>
    <div data-bind="visible: showDeployProgress" style={{display: 'none'}}>
      <ol className="step-list" data-bind="foreach: steps, css: {'failed': !success()}">
        <li className="step-list-item" data-bind="css:{active:isActive, done:isDone, fail:isFail}">
          <span>
            <Icon of="circle-thin" data-bind="css:{'fa-circle-thin': isPending, 'fa-refresh': isActive, 'fa-spin': isActive, 'fa-check': isDone, 'fa-close': isFail}" />
            <span data-bind="text: label"></span>
          </span>
        </li>
      </ol>
      <div data-bind="if: deployLog().length">
        <pre className="logs" data-bind="foreach: deployLog">
          <span data-bind="text: $data"></span><br />
        </pre>
      </div>
      <div data-bind="ifSelected: step, name: 'pull'">
        <pre className="logs" data-bind="foreach: pullStatus">
          <span data-bind="text: id"></span>:
          <span data-bind="text: status"></span>
          <span data-bind="if: progress">(<span data-bind="text: progress"></span>)</span>
          <br />
        </pre>
      </div>
      <div data-bind="ifSelected: step, name: 'done'">
        <p data-bind="if: success">
          <a href={`/spirit/${deploy.name}/life/latest`}>Latest life</a> deployed successfully
        </p>
        <p data-bind="ifnot: success">
          <a href={`/spirit/${deploy.name}/life/latest`}>Latest life</a> failed to deploy
        </p>
      </div>
    </div>
  </section>
);