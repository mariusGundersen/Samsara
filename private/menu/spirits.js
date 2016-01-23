export default function(list, currentSpiritName, newSelected){
  return {
    newSelected: newSelected,
    spirits: list.map(spirit => ({
      name: spirit.name,
      id: spirit.name,
      state: spirit.state,
      stateIcon: getIcon(spirit.state),
      life: spirit.life,
      selected: spirit.name == currentSpiritName
    }))
  };
};

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
