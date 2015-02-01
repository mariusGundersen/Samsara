var Docker = require('dockerode');
var Promise = require('promise');

var docker = new Docker();

module.exports = {
  listContainers: Promise.denodeify(docker.listContainers.bind(docker)),
  pull: Promise.denodeify(docker.pull.bind(docker)),
  createContainer: Promise.denodeify(docker.createContainer.bind(docker)),
  getContainer: function(id){
    var container = docker.getContainer(id);
    return {
      inspect: Promise.denodeify(container.inspect.bind(container)),
      start: Promise.denodeify(container.start.bind(container)),
      stop: Promise.denodeify(container.stop.bind(container)),
      remove: Promise.denodeify(container.remove.bind(container)),
    };
  }
};