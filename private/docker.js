var Docker = require('dockerode');
var Promise = require('promise');

var docker = new Docker();

module.exports = {
  listContainers: Promise.denodeify(docker.listContainers.bind(docker)),
  getContainer: function(id){
    var container = docker.getContainer(id);
    return {
      inspect: Promise.denodeify(container.inspect.bind(container))
    };
  }
};