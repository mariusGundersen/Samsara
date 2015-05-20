const Docker = require('dockerode');
const denodeify = require('denodeify');

const docker = new Docker();

module.exports = {
  listContainers: denodeify(docker.listContainers.bind(docker)),
  pull: function(repoTag, logger){
    return new Promise(function(resolve, reject){
      docker.pull(repoTag, function(err, stream){
        if(err) return reject(err);
        
        docker.modem.followProgress(stream, function(err, output){
          if(err) return reject(err);
          
          resolve(output);
        }, function(event){
          logger.write(JSON.stringify(event)+'\n');
        });
      });
    });
  },
  createContainer: function(){
    return denodeify(docker.createContainer.bind(docker)).apply(this, arguments).then(promiseifyContainer);
  },
  getContainer: function(id){
    return promiseifyContainer(docker.getContainer(id));
  }
};

function promiseifyContainer(container){
  return {
    id: container.id,
    inspect: denodeify(container.inspect.bind(container)),
    restart: denodeify(container.restart.bind(container)),
    start: denodeify(container.start.bind(container)),
    stop: denodeify(container.stop.bind(container)),
    remove: denodeify(container.remove.bind(container)),
    logs: denodeify(container.logs.bind(container))
  };
}
