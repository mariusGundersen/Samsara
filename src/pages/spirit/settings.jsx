import React from 'react';
import Icon from '../../components/icon';
import MainInfo from '../../components/mainInfo';
import Webhook from '../../components/webhook';

export default ({name, mainInfo, webhook}) => (
  <div className="pane content">
    <h2><Icon of="gear" />Spirit settings for {name}</h2>
    <div className="grid-container">
      <MainInfo settings={mainInfo} />
      <Webhook settings={webhook} />
    </div>
  </div>
);