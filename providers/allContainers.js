const docker = require('../private/docker');
const co = require('co');

module.exports = co.wrap(function*(){
  const containers = yield docker.listContainers({all:true});
  return Promise.all(containers.map(function(container){
    return {
      name: container.Names[0].substr(1),
      id: container.Id,
      image: container.Image,
      state: container.Status.indexOf('Up')>=0 ? 'running' : 'stopped',
      status: container.Status
    };
  }));
});