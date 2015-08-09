const samsara = require('samsara-lib');
const co = require('co');
const makePageModel = require('./root');

module.exports = co.wrap(function*(title, content, currentSpiritName){
  const sam = samsara();
  const list = yield sam.spirits();
  const spirits = yield Promise.all(list.map(co.wrap(function*(spirit){
    return {
      name: spirit.name,
      id: spirit.name,
      state: yield spirit.status,
      version: ((yield spirit.currentLife) || (yield spirit.latestLife) || {life: '?'}).life,
      selected: spirit.name == currentSpiritName
    };
  })));
    
  const sortedSpirits = spirits.sort(function(a, b){
    return a.state == 'running' && b.state != 'running' ? -1 : 
    a.state != 'running' && b.state == 'running' ? 1 :
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  });
  
  return makePageModel(title, {
    menu: {
      newSpirit: currentSpiritName == 'new',
      spirits: sortedSpirits
    },
    content: content || {}
  }, 'spirits');
});