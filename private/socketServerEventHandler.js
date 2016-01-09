var eventBus = require('./eventBus');
var EventSaga = require('event-saga');
var deploySaga = require('./deploySaga');

module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('subscribeToDeployStatus', function(name){
      socket.join('spirit/'+name+'/deploy');
      eventBus.emit('deployStatusRequest', {id: name, socket: socket});
    });
  });

  deploySaga(eventBus);

  transformToClient(io, 'spiritDeployStatus');
  transformToClient(io, 'spiritDeployLog');
  transformToClient(io, 'spiritDeployPullStatus');
};

function transformToClient(io, eventName){
  eventBus.on(eventName, function(event){
    if(event.group){
      io.to(event.group).emit(eventName, event.data);
    }else if(event.target){
      event.target.emint(eventName, event.data);
    }else{
      io.emit(eventName, event.data);
    }
  });
}