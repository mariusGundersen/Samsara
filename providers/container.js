var co = require('co');
var spirit = require('./spirit');
var allContainers = require('./allContainers');

const name_version = /^(.*?)(_v\d+)?$/;

module.exports = {
  list: co.wrap(function*(){
    const containers = yield allContainers();
    const spirits = yield spirit.list();
    
    return containers.filter(function(container){
      return !spirits.some(function(spirit){
        var match =  name_version.exec(container.name);
        return match && match[1] == spirit;
      });
    }).sort(function(a, b){
      return a.state == 'running' && b.state != 'running' ? -1 : 
      a.state != 'running' && b.state == 'running' ? 1 :
      a.name < b.name ? -1 : 
      a.name > b.name ? 1 : 
      0
    });
  })
};