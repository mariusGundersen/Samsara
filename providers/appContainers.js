var docker = require('../private/docker');
var Promise = require('promise');

module.exports = function(name){
  return docker.listContainers({all:true})
  .then(function(containers){
    return Promise.all(containers.map(function(container){
      return docker.getContainer(container.Id).inspect()
      .then(function(info){
        return {
          name: info.Name.substr(1),
          id: info.Id,
          image: info.Image,
          state: info.State.Running ? 'running' : 'stopped',
          info: info
        };
      });
    }))
  })
  .then(function(allContainers){
    return allContainers.filter(function(container){
      var match =  /^(.*)_v(\d+)$/.exec(container.name);
      return match && match[1] == name;
    }).map(function(container){
      return {
        name: container.name,
        id: container.id,
        image: container.image,
        state: container.state,
        version: /^(.*)_v(\d+)$/.exec(container.name)[2],
        info: container.info
      };
    }).sort(function(a,b){
      return a.version*1 < b.version*1 ? 1 : a.version*1 > b.version*1 ? -1 : 0;
    });
  });
};