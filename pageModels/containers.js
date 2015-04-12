const docker = require('../private/docker');
const co = require('co');
const makePageModel = require('./root');
const container = require('../providers/container');

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