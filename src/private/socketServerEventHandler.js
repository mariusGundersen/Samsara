import EventSaga from 'event-saga';
import eventBus from './eventBus';
import deploySaga from './deploySaga';
import followSpiritLogSaga from './followSpiritLogSaga';

export default function socketServerEventHandler(io){
  io.on('connection', function(socket){
    socket.on('subscribeToDeployStatus', function(name){
      socket.join('spirit/'+name+'/deploy');
      eventBus.emit('deployStatusRequest', {id: name, target: socket.id});
    });
    socket.on('followSpiritLifeLog', function(data){
      eventBus.emit('followSpiritLifeLog', {
        id: socket.id,
        name: data.name,
        life: data.life,
        target: socket.id
      });
    });
    socket.on('disconnect', function(){
      eventBus.emit('unfollowSpiritLifeLog', {id: socket.id});
    });
    socket.on('unfollowSpiritLifeLog', function(){
      eventBus.emit('unfollowSpiritLifeLog', {id: socket.id});
    });
  });

  deploySaga(eventBus);
  followSpiritLogSaga(eventBus);

  transformToClient(io, 'spiritDeployStatus');
  transformToClient(io, 'spiritDeployLog');
  transformToClient(io, 'spiritDeployPullStatus');
  transformToClient(io, 'spiritLifeLogChunk');
};

function transformToClient(io, eventName){
  eventBus.on(eventName, function(event){
    if(event.target){
      io.to(event.target).emit(eventName, event.data);
    }else{
      io.emit(eventName, event.data);
    }
  });
}
