var eventBus = require('./eventBus');

module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('join', function(room){
      socket.join(room);
    });
  });
  
  eventBus.on('deployLockGained', function(data){
    io.to('spirit/'+data.name+'/deploy').emit('status', {
      isDeploying: true
    });
  });

  eventBus.on('deployLockReleased', function(data){
    io.to('spirit/'+data.name+'/deploy').emit('status', {
      isDeploying: false
    });
  });
};