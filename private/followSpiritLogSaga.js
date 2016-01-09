'use strict'
const co = require('co');
const samsara = require('samsara-lib');
const EventSaga = require('event-saga');
const deploySaga = require('./deploySaga');
const prettifyLogs = require('./prettifyLogs');

module.exports = function(eventBus){

  const saga = new EventSaga(eventBus);

  saga.createOn('followSpiritLifeLog', co.wrap(function*(data){
    const container = yield samsara().spirit(data.name).life(data.life).container;
    const logs = yield container.logs({stdout:true, stderr:true, follow:true, tail:50});
    logs.pipe(prettifyLogs({html:true})).on('data', function(chunk){
    eventBus.emit('spiritLifeLogChunk', {
      target: data.target,
      data: chunk.toString('utf8')});
    });
    this.data.logs = logs;
  }));

  saga.on('unfollowSpiritLifeLog', function(){
    this.data.logs.unpipe();
    this.done();
  });
};
