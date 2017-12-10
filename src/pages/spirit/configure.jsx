import React from 'react';
import Icon from '../../components/icon';
import Repository from '../../components/repository';
import EnvVars from '../../components/envVars';
import Volumes from '../../components/volumes';
import Ports from '../../components/ports';
import Links from '../../components/links';
import VolumesFrom from '../../components/volumesFrom';
import RestartPolicy from '../../components/restartPolicy';

export default ({name, repository, environment, volumes, ports, links, volumesFrom, restartPolicy}) => (
  <div className="pane content">
    <h2><Icon of="wrench" />Container configuration for {name}</h2>
    <p className="text-center">Changes made here will take effect in the next life. Use the Deploy button on the status page to put the new configuration into effect.</p>
    <div className="grid-container">
      <Repository config={repository} />
      <EnvVars config={environment} />
      <Volumes config={volumes} />
      <Ports config={ports} />
      <Links config={links} />
      <VolumesFrom config={volumesFrom} />
      <RestartPolicy config={restartPolicy} />
    </div>
  </div>
);