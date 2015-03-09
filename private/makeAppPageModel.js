var apps = require('../providers/app');
var appContainers = require('../providers/appContainers');
var Promise = require('promise');
var makePageModel = require('./makePageModel');

module.exports = function(title, content, currentAppName){
  return apps.list()
  .then(function(apps){
    return Promise.all(apps.map(function(name){
      return appContainers(name).then(function(versions){        
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
    return makePageModel(title, {
      menu: {
        newApp: currentAppName == 'new',
        apps: apps
      },
      content: content || {}
    }, 'app');
  });
}