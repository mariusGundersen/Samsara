import Icon from "../../components/icon.js";
import MainInfo from "../../components/mainInfo.js";
import Webhook from "../../components/webhook.js";

export default ({name, mainInfo, webhook}) => (
  <div className="pane content">
    <h2><Icon of="gear" />Spirit settings for {name}</h2>
    <div className="grid-container">
      <MainInfo settings={mainInfo} />
      <Webhook settings={webhook} />
    </div>
  </div>
);