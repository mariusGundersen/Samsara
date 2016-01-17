const samsara = require('samsara-lib');
const co = require('co');
const makePageModel = require('./root');

module.exports = co.wrap(function*(title, content, currentSpiritName){
  const list = yield samsara().spirits();
  const spirits = list.map(spirit => ({
    name: spirit.name,
    id: spirit.name,
    state: spirit.state,
    stateIcon: getIcon(spirit.state),
    life: spirit.life,
    selected: spirit.name == currentSpiritName
  }));

  return makePageModel(title, {
    menu: {
      newSpirit: currentSpiritName == 'new',
      spirits: spirits
    },
    content: content || {spirits: spirits}
  }, 'spirits');
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