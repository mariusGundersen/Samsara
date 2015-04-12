const qvc = require('qvc');
const docker = require('../private/docker');

module.exports = [
  qvc.command('stopContainer', function(command){
    console.log("stopContainer", command.id);
    return docker.getContainer(command.id).stop();
  }),
  qvc.command('startContainer', function(command){
    console.log("startContainer", command.id);
    return docker.getContainer(command.id).start();
  }),
  qvc.command('removeContainer', function(command){
    console.log("removeContainer", command.id);
    return docker.getContainer(command.id).remove();
  }),
  qvc.command('restartContainer', function(command){
    console.log("restartContainer", command.id);
    return docker.getContainer(command.id).restart();
  })
];