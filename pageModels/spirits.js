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
      life: ((yield spirit.currentLife) || (yield spirit.latestLife) || {life: '?'}).life,
      selected: spirit.name == currentSpiritName
    };
  })));
  
  return makePageModel(title, {
    menu: {
      newSpirit: currentSpiritName == 'new',
      spirits: spirits
    },
    content: content || {}
  }, 'spirits');
});