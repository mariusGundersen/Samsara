var spirits = require('../providers/spirit');
var spiritContainers = require('../providers/spiritContainers');
var Promise = require('promise');
var makePageModel = require('./makePageModel');

module.exports = function(title, content, currentSpiritName){
  return spirits.list()
  .then(function(spirits){
    return Promise.all(spirits.map(function(name){
      return spiritContainers(name).then(function(versions){
        var runningContainer = versions.filter(function(c){ return c.state == 'running'})[0];
        
        return {
          name: name,
          id: name,
          state: runningContainer ? 'running' : 'stopped',
          version: runningContainer ? runningContainer.version : versions[0] ? versions[0].version : 0
        };
      });
    }))
    .then(function(list){
      list.filter(function(spirit){
        return spirit.name == currentSpiritName;
      }).forEach(function(spirit){
        spirit.selected = true;
      });
      
      return list.sort(function(a, b){
        return a.state == 'running' && b.state != 'running' ? -1 : 
        a.state != 'running' && b.state == 'running' ? 1 :
        a.name < b.name ? -1 : 
        a.name > b.name ? 1 : 
        0
      });
    });
  })
  .then(function(spirits){
    return makePageModel(title, {
      menu: {
        newSpirit: currentSpiritName == 'new',
        spirits: spirits
      },
      content: content || {}
    }, 'spirit');
  });
}