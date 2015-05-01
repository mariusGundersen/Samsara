const docker = require('../private/docker');
const co = require('co');

module.exports = co.wrap(function*(){
  const containers = yield docker.listContainers({all:true});
  return containers.map(function(container){
    const name = container.Names.filter(function(name){
      return name.lastIndexOf('/') === 0;
    })[0].substr(1);
    return {
      name: name,
      id: container.Id,
      image: container.Image,
      state: container.Status.indexOf('Up')>=0 ? 'running' : 'stopped',
      status: container.Status
    };
  });
});