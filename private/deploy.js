var docker = require('./docker');
var Promise = require('promise');

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
    return docker.createContainer({
      Image: config.image, 
      name: newName
    })
    .then(function(container){
      console.log("starting container");
      return container.start();
    }).then(function(){
      console.log("stopping old container", oldContainer.id);
      return oldContainer.id;
    });
  })
  .then(function stopOldContainer(id){
    if(!id){
      return Promise.resolve();
    }
    console.log("finding old container", id);
    var container = docker.getContainer(id);
    console.log("old container found", container);
    return container.stop()
    .then(function(){
      console.log("removing old container");
      return container.remove();
    });
  });
};

function getPreviousContainer(name){
  return docker.listContainers()
  .then(function (containers) {

    var oldContainer = containers.filter(function(container){
      return container.Names[0].indexOf('/'+name+'_v') == 0;
    })[0];

    if(oldContainer){
      var version = /_v(\d+)$/.exec(oldContainer.Names[0])[1];
      return {
        id: oldContainer.Id, 
        version: version*1, 
        name: name
      };
    }else{
      return {
        id: null, 
        version: 0, 
        name: name
      };
    }
  });
}