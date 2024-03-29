import Icon from "../../components/icon.js";
import MenuPane from "../../components/menuPane.js";
import nth from "../../private/nthLife.js";

export default ({spirits, newSelected, selectedSpiritName}) => (
  <MenuPane icon="sun-o" href="/spirits" title="Spirits">
    <ul>
      <li className={newSelected ? 'selected' : ''}>
        <a href="/spirit/new"><Icon of="plus" />Create new spirit</a>
      </li>
      {spirits.map(spirit => (
        <li className={spirit.name == selectedSpiritName ? 'selected' : ''} key={spirit.name}>
          <a href={`/spirit/${spirit.name}`}>
            <Icon of={getIcon(spirit.state)} className="container-state" />
            {spirit.name} <span className="container-life">({nth(spirit.life)} life)</span>
          </a>
        </li>
      ))}
    </ul>
  </MenuPane>
);

function getIcon(state){
  switch(state){
    case 'running': return 'play';
    case 'paused': return 'pause';
    case 'exited': return 'stop';
    case 'restarting': return 'spinner fa-spin';
    case 'deploying': return 'spinner fa-spin';
    default: return 'stop'
  }
}
