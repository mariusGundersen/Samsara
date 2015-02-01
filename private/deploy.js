var docker = require('./docker');
var request = require('request');
var Promise = require('promise');

module.exports = function(imageName, containerName, callbackUrl){
  console.log(imageName);
  
  docker.pull(imageName)
  .then(function (stream) {
    return new Promise(function(resolve, reject){
      console.log("pulling")
      stream.pipe(process.stdout);
      stream.on('end', function(){
        console.log('done pulling');
        resolve(containerName);
      });
    });
  })
  .then(getPreviousContainer)
  .then(function(oldContainer){
    var newName = oldContainer.name+'_v'+(oldContainer.version+1);
    console.log("creating container", newName);
    return docker.createContainer({
      Image: imageName, 
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
  })
  .then(function(){
    request.post({
      url: callbackUrl,
      body: JSON.stringify({
        state: 'success',
        context: 'decojs.com website',
        descrption: 'deployed',
        target_url: 'http://decojs.com'
      })
    }, function(err, resp, body){
      console.log('response', body);
    });
  }).catch(function(error){
    console.error(error);
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