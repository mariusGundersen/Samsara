import EnvVars from "../../components/envVars.js";
import Icon from "../../components/icon.js";
import Labels from "../../components/labels.js";
import Links from "../../components/links.js";
import Ports from "../../components/ports.js";
import Repository from "../../components/repository.js";
import RestartPolicy from "../../components/restartPolicy.js";
import Volumes from "../../components/volumes.js";
import VolumesFrom from "../../components/volumesFrom.js";

export default ({name, repository, environment, volumes, ports, links, volumesFrom, labels, restartPolicy}) => (
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
      <Labels config={labels} />
      <RestartPolicy config={restartPolicy} />
    </div>
  </div>
);