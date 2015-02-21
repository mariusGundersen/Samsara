var apps = require('../providers/app');
var Promise = require('promise');

module.exports = function(title, content, currentAppName){
  return apps.list()
  .then(function(apps){
    return apps.map(function(name){
      return {
        name: name,
        id: name,
        state: name ? 'running' : 'stopped'
      };
    });
  })
  .then(function(apps){
    return {
      mainMenu: {
        apps: apps
      },
      title: title,
      content: content
    }
  });
}