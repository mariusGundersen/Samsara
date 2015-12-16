const docker = require('./docker');
const co = require('co');
const extend = require('extend');
const samsara = require('samsara-lib');
const fs = require('fs-promise');
const mkdirp = require('mkdirp-then');
const eventBus = require('./eventBus');

module.exports = {
  deploy: co.wrap(function*(name){
    const spirit = samsara().spirit(name);
    const progress = spirit.deploy();
    progress.on('start', translateEvent(eventBus, 'spirit.deploy.start'));
    progress.on('message', translateEvent(eventBus, 'spirit.deploy.message'));
    progress.on('stage', translateEvent(eventBus, 'spirit.deploy.stage'));
    progress.on('stop', translateEvent(eventBus, 'spirit.deploy.stop'));
  }),
  revive: co.wrap(function*(name, life){
    const spirit = samsara().spirit(name);
    const progress = spirit.revive(life);
    progress.on('start', translateEvent(eventBus, 'spirit.deploy.start'));
    progress.on('message', translateEvent(eventBus, 'spirit.deploy.message'));
    progress.on('stage', translateEvent(eventBus, 'spirit.deploy.stage'));
    progress.on('stop', translateEvent(eventBus, 'spirit.deploy.stop'));
  })
};

function translateEvent(out, name){
  return event => out.emit(name, Object.assign({id: event.spirit}, event));
}
