var docker = require('../private/docker');
var Promise = require('promise');

module.exports = function(){
  return docker.listContainers({all:true})
  .then(function(containers){
    return Promise.all(containers.map(function(container){
      return {
        name: container.Names[0].substr(1),
        id: container.Id,
        image: container.Image,
        state: container.Status.indexOf('Up')>=0 ? 'running' : 'stopped',
        status: container.Status
      };
    }));
  });
};