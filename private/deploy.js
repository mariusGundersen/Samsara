var docker = require('./docker');
var co = require('co');
var extend = require('extend');
var createContainerFromConfig = require('./createContainerFromConfig');
var spiritContainers = require('../providers/spiritContainers');

module.exports = co.wrap(function*(config){
  console.log(config.image);
  
  yield docker.pull(config.image);
  console.log('done pulling');
  
  const oldContainers = yield spiritContainers(config.name);
  const version = (oldContainers[0] || {version:0}).version || 0;
  const newName = config.name + '_v' + (version+1);
  console.log("creating container", newName);
  
  const dockerConfig = yield createContainerFromConfig(newName, config);
  console.log("dockerConfig created");
  
  const container = yield docker.createContainer(dockerConfig)
  console.log("starting container");
  
  yield container.start();
  console.log("container started");
  
  console.log("stopping old containers", oldContainers.length);
  yield oldContainers.filter(function(container){
    return container.state === 'running';
  }).map(co.wrap(function*(container){
    const id = container.id;
    console.log("old container found, will be stopped and removed", id);
    yield docker.getContainer(id).stop();
    console.log("stopped old container", id);
  }));
});