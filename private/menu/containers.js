module.exports = function(containers, currentContainerId){
  return containers.map(container => ({
    name: container.name,
    id: container.id,
    image: container.image,
    state: container.state,
    stateIcon: getIcon(container.state),
    status: container.status,
    selected: container.id == currentContainerId
  }));
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
