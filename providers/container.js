var Promise = require('promise');
var spirit = require('./spirit');
var allContainers = require('./allContainers');

function container(){
  
};

container.list = function(){
  return allContainers()
  .then(function(containers){
    return spirit.list().then(function(spirits){
      return containers.filter(function(container){
        return !spirits.some(function(spirit){
          var match =  /^(.*?)(_v\d+)?$/.exec(container.name);
          return match && match[1] == spirit;
        });
      }).sort(function(a, b){
        return a.state == 'running' && b.state != 'running' ? -1 : 
        a.state != 'running' && b.state == 'running' ? 1 :
        a.name < b.name ? -1 : 
        a.name > b.name ? 1 : 
        0
      });
    });
  });
};

module.exports = container;