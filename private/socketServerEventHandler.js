var eventBus = require('./eventBus');
var EventSaga = require('event-saga');

module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('subscribeToDeployStatus', function(name){
      socket.join('spirit/'+name+'/deploy');
      eventBus.emit('deployStatusRequest', {id: name, socket: socket});
    });
  });
  
  var deploySaga = new EventSaga(eventBus);
  
  deploySaga.createOn('deployLockGained', function(data){
    this.data = {
      isDeploying: true,
      step: 'init',
      plan: data.plan
    };
    io.to('spirit/'+this.id+'/deploy').emit('spiritDeployStatus', this.data);
  });
  
  deploySaga.on('deployStatusRequest', function(data){
    data.socket.emit('spiritDeployStatus', this.data);
  });

  deploySaga.on('deployProcessStep', function(data){
    this.data.step = data.step;
    io.to('spirit/'+this.id+'/deploy').emit('spiritDeployStatus', this.data);
  });
  
  deploySaga.on('deployProcessPullStepProgress', function(data){
    if(data && 'progress' in data && 'id' in data.progress){
      io.to('spirit/'+this.id+'/deploy').emit('spiritDeployPullStatus', data.progress);
    }
  });
  
  deploySaga.on('deployLockReleased', function(data){
    this.data.step = 'done';
    this.data.isDeploying = false;
    this.data.success = data.success;
    io.to('spirit/'+this.id+'/deploy').emit('spiritDeployStatus', this.data);
    this.done();
  });
};