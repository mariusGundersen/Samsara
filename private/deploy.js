var docker = require('./docker');
var Promise = require('promise');
var extend = require('extend');
var createContainerFromConfig = require('./createContainerFromConfig');

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
  .then(getPreviousContainer)
  .then(function(oldContainer){
    var newName = oldContainer.name+'_v'+(oldContainer.version+1);
    console.log("creating container", newName);
    return docker.createContainer(createContainerFromConfig(newName, config))
    .then(function(container){
      console.log("starting container");
      return container.start();
    }).then(function(){
      console.log("container started");
      return oldContainer.ids;
    });
  })
  .then(function stopOldContainers(ids){
    if(!ids || !ids.length){
      return Promise.resolve();
    }
    
    console.log("stopping old containers", ids);
    return Promise.all(ids.map(function(id){
      var container = docker.getContainer(id);
      console.log("old container found, will be stopped and removed", id);
      return container.stop()
      .then(function(){
        console.log("stopped old container", id);
        //return container.remove();
      }, function(){
        console.log("container already stopped", id);
        //return container.remove();
      });
    }));
  });
};

function getPreviousContainer(name){
  return docker.listContainers({all: true})
  .then(function (containers) {
    var oldContainers = containers.filter(function(container){
      var match =  /^\/(.*?)(_v(\d+))?$/.exec(container.Names[0]);
      return match && match[1] == name;
    }).map(function(container){
      var match = /_v(\d+)$/.exec(container.Names[0]);
      return {version: match ? [1]*1 : 0, id: container.Id};
    }).sort(function(a, b){
      return a.version<b.version ? 1 : a.version>b.version ? -1 : 0;
    });

    if(oldContainers.length){
      return {
        ids: oldContainers.map(function(container){return container.id;}), 
        version: oldContainers[0].version,
        name: name
      };
    }else{
      return {
        ids: [], 
        version: 0, 
        name: name
      };
    }
  });
}