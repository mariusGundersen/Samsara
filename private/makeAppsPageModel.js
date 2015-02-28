var apps = require('../providers/app');
var docker = require('./docker');
var Promise = require('promise');

module.exports = function(title, content, currentAppName){
  return apps.list()
  .then(function(apps){
    return Promise.all(apps.map(function(name){
      return docker.listContainers({all:true})
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
            version: /^(.*)_v(\d+)$/.exec(container.name)[2]
          };
        }).sort(function(a,b){
          return a.version < b.version ? 1 : a.version > b.version ? -1 : 0;
        });
      }).then(function(versions){
        
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
      
      list.filter(function(app){
        return app.name == currentAppName;
      }).forEach(function(app){
        app.selected = true;
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
  .then(function(apps){
    return {
      mainMenu: {
        apps: apps
      },
      title: title,
      content: content || {}
    }
  });
}