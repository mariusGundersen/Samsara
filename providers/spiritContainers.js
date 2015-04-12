const docker = require('../private/docker');
const allContainers = require('./allContainers');
const co = require('co');

const name_version = /^(.*?)(_v(\d+))?$/;

module.exports = co.wrap(function*(name){
  const containers = yield allContainers();
  
  return containers.filter(function(container){
    const match = name_version.exec(container.name);
    return match && match[1] == name;
  }).map(function(container){
    return {
      spirit: name,
      name: container.name,
      id: container.id,
      image: container.image,
      state: container.state,
      status: container.status.split(' ').slice(container.state == 'running' ? 1 : 2).join(' '),
      version: (name_version.exec(container.name)[3] || 0)|0
    };
  }).sort(function(a,b){
    return a.version < b.version ? 1 : a.version > b.version ? -1 : 0;
  });
});