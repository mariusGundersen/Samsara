var docker = require('./docker');
var Promise = require('promise');

module.exports = {
  containers: function(){
    return docker.listContainers({all: true})
    .then(function(containers){
      return Promise.all(containers.map(function(container){
        return docker.getContainer(container.Id).inspect().then(function(info){
          return {
            name: info.Name.substr(1),
            id: info.Id,
            image: info.Image,
            state: info.State.Running ? 'running' : 'stopped'
          };
        });
      }))
      .then(function(list){
        return list.sort(function(a, b){
          return a.state == 'running' && b.state != 'running' ? -1 : 
          a.state != 'running' && b.state == 'running' ? 1 :
          a.name < b.name ? -1 : 
          a.name > b.name ? 1 : 
          0
        });
      });
    });
  }
}