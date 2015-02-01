var Docker = require('dockerode');
var Promise = require('promise');

var docker = new Docker();

module.exports = {
  listContainers: Promise.denodeify(docker.listContainers.bind(docker))
};