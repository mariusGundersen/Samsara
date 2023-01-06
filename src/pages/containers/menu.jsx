import Icon from "../../components/icon.js";
import MenuPane from "../../components/menuPane.js";

export default ({containers}) => (
  <MenuPane icon="th-large" href="/containers" title="Containers">
    <ul>
      {containers.map(container => (
        <li data-viewmodel="MenuListContainerVM"
            data-model={JSON.stringify(container)}
            key={container.id}
            className={container.selected ? 'selected' : ''}>
          <a href={`/container/${container.id}`}>
            <Icon of={getIcon(container.state)} className="container-state"
            data-bind="css:{
              'fa-play':running,
              'fa-stop': stopped,
              'fa-pause': paused,
              'fa-spinner': busy,
              'fa-spin': busy
            }" />
            {container.name}
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
