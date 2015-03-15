var Promise = require('promise');
var docker = require('../private/docker');
var app = require('./app');

function container(){
  
};

container.list = function(){
  return docker.listContainers({all: true})
  .then(function(containers){
    return Promise.all(containers.map(function(container){
      return docker.getContainer(container.Id).inspect().then(function(info){
        return {
          name: info.Name.substr(1),
          id: info.Id,
          image: container.Image,
          state: info.State.Running ? 'running' : 'stopped',
          status: container.Status
        };
      });
    }))
    .then(function(list){
      return app.list().then(function(apps){
        return list.filter(function(container){
          return !apps.some(function(app){
            var match =  /^(.*?)(_v\d+)?$/.exec(container.name);
            return match && match[1] == app;
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
  })
};

module.exports = container;