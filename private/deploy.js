var docker = require('./docker');
var Promise = require('promise');
var extend = require('extend');

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
    return docker.createContainer(extend({
      Image: config.image, 
      name: newName
    }, config.raw))
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
        console.log("removing old container", id);
        return container.remove();
      }, function(){
        console.log("container already stopped, removing it", id);
        return container.remove();
      });
    }));
  });
};

function getPreviousContainer(name){
  return docker.listContainers({all: true})
  .then(function (containers) {

    var oldContainers = containers.filter(function(container){
      return container.Names[0].indexOf('/'+name+'_v') == 0;
    }).map(function(container){
      return {version: /_v(\d+)$/.exec(container.Names[0])[1]*1, id: container.Id};
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