'use strict'
const co = require('co');
const samsara = require('samsara-lib');
const EventSaga = require('event-saga');
const deploySaga = require('./deploySaga');

module.exports = function(eventBus){
  const saga = new EventSaga(eventBus);

  saga.createOn('followSpiritLifeLog', co.wrap(function*(data){
    const logs = yield samsara()
      .spirit(data.name)
      .life(data.life)
      .containerLog(true, {stdout:true, stderr:true, follow:true, tail:50});
    logs.on('data', function(chunk){
      eventBus.emit('spiritLifeLogChunk', {
        target: data.target,
        data: chunk.toString('utf8')
      });
    });
    this.data.logs = logs;
  }));

  saga.on('unfollowSpiritLifeLog', function(){
    this.data.logs.unpipe();
    this.done();
  });
};
