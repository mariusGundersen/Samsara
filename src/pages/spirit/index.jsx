import Controls from "../../components/controls.js";
import Deploy from "../../components/deploy.js";
import Icon from "../../components/icon.js";
import nth from "../../private/nthLife.js";

export default ({name, life, description, controls, deploy}) => (
  <div className="pane content">
    <h2><Icon of="info-circle" />{name} (<a className="no-link" href={`/spirit/${name}/life/${life}`}>{nth(life)} life</a>)</h2>
        <p className="text-center">
          {description}
        </p>
    <div className="grid-container">
      <Controls controls={controls} />
      <Deploy deploy={deploy} />
    </div>
  </div>
);