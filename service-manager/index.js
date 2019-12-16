const repositoryLoader = require('../repository-loader');
const dataHandler = require('../data-handler');
const validation = require('../validation');
const http = require('../http');
const bus = require('../bus');
const eventHandlerLoader = require('../event-handler-loader');
const responseHandler = require('../response-rule-loader');
const knex = require('../knex');

class ServiceManager {

    constructor() {
        this.services = new Map();
        this.set('knex', knex);
        this.set('event-handler.loader', eventHandlerLoader);
        this.set('response.handler', responseHandler);
        this.set('repository.loader', repositoryLoader);
        this.set('data.handler', dataHandler);
        this.set('validation', validation);
        this.set('http', http);
        this.set('bus', bus);
    }

    get(name) {
        return this.services.get(name);
    }

    set(name, singleton) {
        this.services.set(name, singleton)
    }
}

const singleton = new ServiceManager;
module.exports = singleton;