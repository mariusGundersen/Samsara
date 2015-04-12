const spiritList = require('../providers/spirit').list;
const spiritContainers = require('../providers/spiritContainers');
const co = require('co');
const makePageModel = require('./root');

module.exports = co.wrap(function*(title, content, currentSpiritName){
  const list = yield spiritList();
  const spirits = yield list.map(co.wrap(function*(name){
    const versions = yield spiritContainers(name)
    var runningContainer = versions.filter(function(c){ return c.state == 'running'})[0];

    return {
      name: name,
      id: name,
      state: runningContainer ? 'running' : 'stopped',
      version: runningContainer ? runningContainer.version : versions[0] ? versions[0].version : 0
    };
  }));
  
  spirits.filter(function(spirit){
    return spirit.name == currentSpiritName;
  }).forEach(function(spirit){
    spirit.selected = true;
  });
    
  const sortedSpirits = spirits.sort(function(a, b){
    return a.state == 'running' && b.state != 'running' ? -1 : 
    a.state != 'running' && b.state == 'running' ? 1 :
    a.name < b.name ? -1 : 
    a.name > b.name ? 1 : 
    0
  });
  
  return makePageModel(title, {
    menu: {
      newSpirit: currentSpiritName == 'new',
      spirits: sortedSpirits
    },
    content: content || {}
  }, 'spirits');
});