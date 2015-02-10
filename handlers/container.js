var qvc = require('qvc');
var docker = require('../private/docker');

module.exports = [
  qvc.command('stopContainer', function(command, done){
    console.log("stopContainer", command.id);
    docker.getContainer(command.id).stop().then(function(){
      console.log("stopped");
      done(null, true);
    }, function(err){
      console.log("stopped failed", err);
      done(err);
    });
  }),
  qvc.command('startContainer', function(command, done){
    console.log("startContainer", command.id);
    docker.getContainer(command.id).start().then(function(){
      console.log("started");
      done(null, true);
    }, function(err){
      console.log("started failed", err);
      done(err);
    });
  }),
  qvc.command('restartContainer', function(command, done){
    console.log("restartContainer", command.id);
    docker.getContainer(command.id).restart().then(function(){
      console.log("restarted");
      done(null, true);
    }, function(err){
      console.log("restarted failed", err);
      done(err);
    });
  })
];