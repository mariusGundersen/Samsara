import React from 'react';
import Icon from './icon';
import {appendSuffix} from 'nth';

export default ({deploy}) => (
  <div data-viewmodel="spirit/DeployProgressVM"
      data-model={JSON.stringify(deploy)}
      data-bind="visible: showDeployProgress"
      style={{display: 'none'}}>
    <ol class="step-list" data-bind="foreach: steps, css: {'failed': !success()}">
      <li class="step-list-item" data-bind="css:{active:isActive, done:isDone, fail:isFail}">
        <span>
          Icon of="circle-thin" data-bind="css:{
                                              'fa-circle-thin': isPending,
                                              'fa-refresh': isActive,
                                              'fa-spin': isActive,
                                              'fa-check': isDone,
                                              'fa-close': isFail
                                            }" />
          <span data-bind="text: label"></span>
        </span>
      </li>
    </ol>
    <div data-bind="if: deployLog().length">
      <pre class="logs" data-bind="foreach: deployLog">
        <span data-bind="text: $data"></span><br />
      </pre>
    </div>
    <div data-bind="ifSelected: step, name: 'pull'">
      <pre class="logs" data-bind="foreach: pullStatus">
        <span data-bind="text: id"></span>:
        <span data-bind="text: status"></span>
        <span data-bind="if: progress">(<span data-bind="text: progress"></span>)</span>
        <br />
      </pre>
    </div>
    <div data-bind="ifSelected: step, name: 'done'">
      <p data-bind="if: success">
        Successfully revived the <a href={`/spirit/${deploy.name}/life/${deploy.life}`}>{nth(deploy.life)}</a> life of <a href={`/spirit/${deploy.name}`}>{deploy.name}</a>
      </p>
      <p data-bind="ifnot: success">
        Failed to revive the <a href={`/spirit/${deploy.name}/life/${deploy.life}`}>${nth(deploy.life)}</a> life of <a href={`/spirit/${deploy.name}`}>{deploy.name}</a>
      </p>
    </div>
  </div>
);

function nth(n){
  try{
    return appendSuffix(n);
  }catch(e){
    return 'no';
  }
}