var docker = require('./docker');
var Promise = require('promise');

module.exports = function(title, content, currentContainerId){
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
      
      list.filter(function(container){
        return container.id == currentContainerId;
      }).forEach(function(container){
        container.selected = true;
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
  .then(function(containers){
    return {
      mainMenu: {
        containers: containers
      },
      title: title,
      content: content
    }
  });
}