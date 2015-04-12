var docker = require('../private/docker');
var co = require('co');
var makePageModel = require('./root');
var container = require('../providers/container');

module.exports = co.wrap(function*(title, content, currentContainerId){
  const containers = yield container.list();
  
  containers.filter(function(container){
    return container.id == currentContainerId;
  }).forEach(function(container){
    container.selected = true;
  });
  
  return makePageModel(title, {
    menu: {
      containers: containers
    },
    content: content || {}
  }, 'containers');
});