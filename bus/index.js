const EventEmitter = require('events').EventEmitter;
const singleton = new EventEmitter();

module.exports = singleton;