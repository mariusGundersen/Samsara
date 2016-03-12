import React from 'react';
import Icon from '../../components/icon';
import Controls from '../../components/controls';
import Deploy from '../../components/deploy';
import {appendSuffix} from 'nth';

export default ({name, life, description, controls, deploy}) => (
  <div className="pane content">
    <h2><Icon of="info-circle" />{name} (<a className="no-link" href={`${name}/life/${life}`}>{nth(life)} life</a>)</h2>
        <p className="text-center">
          {description}
        </p>
    <div className="grid-container">
      <Controls controls={controls} />
      <Deploy deploy={deploy} />
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