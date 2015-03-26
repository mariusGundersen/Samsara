var Docker = require('dockerode');
var Promise = require('promise');

var docker = new Docker();

module.exports = {
  listContainers: Promise.denodeify(docker.listContainers.bind(docker)),
  pull: function(repoTag){
    return new Promise(function(resolve, reject){
      docker.pull(repoTag, function(err, stream){
        if(err) return reject(err);
        
        docker.modem.followProgress(stream, function(err, output){
          if(err) return reject(err);
          
          resolve(output);
        });
      });
    });
  },
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
    logs: Promise.denodeify(container.logs.bind(container))
  };
}
