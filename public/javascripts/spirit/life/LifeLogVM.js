define([
  'knockout',
  'io'
], function(
  ko,
  io
){
  return function LifeLogVM(model, when){
    var self = this;

    this.isFollowing = ko.observable(false);
    this.log = ko.observableArray();

    this.toggleFollowLogs = function(){
      self.isFollowing(!self.isFollowing());
      if(self.isFollowing()){
        this.log([]);
        socket.emit('followSpiritLifeLog', {name: model.name, life: model.life});
      }else{
        socket.emit('unfollowSpiritLifeLog', {name: model.name, life: model.life});
      }
    };

    init: {
      var socket = io.connect();

      socket.on('spiritLifeLogChunk', function(chunk){
        self.log.push(chunk);
      });
    }
  };
});