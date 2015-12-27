const qvc = require('qvc');
const samsara = require('samsara-lib');

module.exports = [
  qvc.command('stopContainer', function(command){
    console.log("stopContainer", command.id);
    return samsara().container(command.id).stop();
  }),
  qvc.command('startContainer', function(command){
    console.log("startContainer", command.id);
    return samsara().container(command.id).start();
  }),
  qvc.command('removeContainer', function(command){
    console.log("removeContainer", command.id);
    return samsara().container(command.id).remove();
  }),
  qvc.command('restartContainer', function(command){
    console.log("restartContainer", command.id);
    return samsara().container(command.id).restart();
  })
];