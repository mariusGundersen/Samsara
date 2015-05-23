var eventBus = require('./eventBus');
var EventSaga = require('event-saga');

module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('subscribeToDeployStatus', function(name){
      socket.join('spirit/'+name+'/deploy',);
      eventBus.emit('deployStatusRequest', {id: name, socket: socket});
    });
  });
  
  var deploySaga = new EventSaga(eventBus);
  
  deploySaga.createOn('deployLockGained', function(data){
    this.data = {
      isDeploying: true,
      step: 'start'
    };
    publish(io, this.id, this.data);
  });
  
  deploySaga.on('deployStatusRequest', function(data){
    data.socket.emit('status', this.data);
  });

  deploySaga.on('deployProcessStep', function(data){
    this.data.step = data.step;
    publish(io, this.id, this.data);
  });
  
  deploySaga.on('deployLockReleased', function(data){
    this.data.step = 'done';
    this.data.isDeploying = false;
    publish(io, this.id, this.data);
    this.done();
  });
};

function publish(io, name, data){
  io.to('spirit/'+name+'/deploy').emit('status', data);
}