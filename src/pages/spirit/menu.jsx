import Icon from "../../components/icon.js";
import MenuPane from "../../components/menuPane.js";

export default ({name, selected}) => (
  <MenuPane icon="sun-o" href={`/spirits/${name}`} title={name}>
    <ul>
      <li className={selected == 'status' ? 'selected' : ''}>
        <a href={`/spirit/${name}/`}><Icon of="info" />Status</a>
      </li>
      <li className={selected == 'settings' ? 'selected' : ''}>
        <a href={`/spirit/${name}/settings`}><Icon of="gear" />Spirit settings</a>
      </li>
      <li className={selected == 'configure' ? 'selected' : ''}>
        <a href={`/spirit/${name}/configure`}><Icon of="wrench" />Container config</a>
      </li>
      <li className={selected == 'lives' ? 'selected' : ''}>
        <a href={`/spirit/${name}/lives`}><Icon of="history" />Lives</a>
      </li>
    </ul>
  </MenuPane>
);