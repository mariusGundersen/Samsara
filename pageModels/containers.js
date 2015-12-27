const co = require('co');
const makePageModel = require('./root');
const samsara = require('samsara-lib');

module.exports = co.wrap(function*(title, content, currentContainerId){
  const containers = yield samsara().containers();

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