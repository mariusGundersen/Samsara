var docker = require('./docker');
var Promise = require('promise');
var extend = require('extend');
var createContainerFromConfig = require('./createContainerFromConfig');
var spiritContainers = require('../providers/spiritContainers');

module.exports = function deploy(config){
  console.log(config.image);
  
  return docker.pull(config.image)
  .then(function (stream) {
    return new Promise(function(resolve, reject){
      console.log("pulling")
      stream.pipe(process.stdout);
      stream.on('end', function(){
        console.log('done pulling');
        resolve(config.name);
      });
    });
  })
  .then(function(name){
    return spiritContainers(name)
    .then(function (oldContainers) {
      return {
        oldContainers: oldContainers, 
        version: (oldContainers[0] || {version:0}).version,
        name: name
      };
    });
  })
  .then(function(spirit){
    var newName = spirit.name + '_v' + (spirit.version+1);
    console.log("creating container", newName);
    return docker.createContainer(createContainerFromConfig(newName, config))
    .then(function(container){
      console.log("starting container");
      return container.start();
    }).then(function(){
      console.log("container started");
      return spirit.oldContainers;
    });
  })
  .then(function stopOldContainers(containers){    
    console.log("stopping old containers", containers.length);
    return Promise.all(containers.filter(function(container){
      return container.state === 'running';
    }).map(function(container){
      var id = container.id;
      var container = docker.getContainer(id);
      console.log("old container found, will be stopped and removed", id);
      return container.stop()
      .then(function(){
        console.log("stopped old container", id);
      });
    }));
  });
};