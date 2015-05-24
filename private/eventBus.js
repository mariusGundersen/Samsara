var EventEmitter = require('events').EventEmitter;

var singleton = new EventEmitter();

module.exports = singleton;