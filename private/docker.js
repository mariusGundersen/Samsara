var Docker = require('dockerode');
var Promise = require('promise');

var docker = new Docker();

module.exports = {
  listContainers: Promise.denodeify(docker.listContainers.bind(docker)),
  pull: Promise.denodeify(docker.pull.bind(docker)),
  createContainer: function(){
    return Promise.denodeify(docker.createContainer.bind(docker)).apply(this, arguments).then(promiseifyContainer);
  },
  getContainer: function(id){
    return promiseifyContainer(docker.getContainer(id));
  }
};

function promiseifyContainer(container){
  return {
    inspect: Promise.denodeify(container.inspect.bind(container)),
    restart: Promise.denodeify(container.restart.bind(container)),
    start: Promise.denodeify(container.start.bind(container)),
    stop: Promise.denodeify(container.stop.bind(container)),
    remove: Promise.denodeify(container.remove.bind(container)),
  };
}