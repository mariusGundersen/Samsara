const co = require('co');
const makePageModel = require('./root');
const samsara = require('samsara-lib');

module.exports = co.wrap(function*(title, content, currentContainerId){
  const list = yield samsara().containers();

  const containers = list.map(container => ({
    name: container.name,
    id: container.id,
    image: container.image,
    state: container.state,
    stateIcon: getIcon(container.state),
    status: container.status,
    selected: container.id == currentContainerId
  }));

  return makePageModel(title, {
    menu: {
      containers: containers
    },
    content: content || {}
  }, 'containers');
});

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