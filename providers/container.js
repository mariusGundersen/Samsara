var Promise = require('promise');
var app = require('./app');
var allContainers = require('./allContainers');

function container(){
  
};

container.list = function(){
  return allContainers()
  .then(function(containers){
    return app.list().then(function(apps){
      return containers.filter(function(container){
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
};

module.exports = container;