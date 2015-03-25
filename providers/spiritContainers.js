var docker = require('../private/docker');
var allContainers = require('./allContainers');
var Promise = require('promise');

module.exports = function(name){
  return allContainers()
  .then(function(containers){
    return containers.filter(function(container){
      var match =  /^(.*?)(_v(\d+))?$/.exec(container.name);
      return match && match[1] == name;
    }).map(function(container){
      return {
        spirit: name,
        name: container.name,
        id: container.id,
        image: container.image,
        state: container.state,
        status: container.status.split(' ').slice(container.state == 'running' ? 1 : 2).join(' '),
        version: (/^(.*?)(_v(\d+))?$/.exec(container.name)[3] || 0)|0
      };
    }).sort(function(a,b){
      return a.version < b.version ? 1 : a.version > b.version ? -1 : 0;
    });
  });
};