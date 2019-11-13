const repositoryLoader = require('../repository-loader');
const schema = require('../schema');
const dataHandler = require('../data-handler');
const validation = require('../validation');
const http = require('../http');
const bus = require('../bus');
const eventHandlerLoader = require('../event-handler-loader');
const responseHandler = require('../response-handler');
const requestHandler = require('../request-handler');

class ServiceManager {

    constructor() {
        this.services = new Map();
        this.set('knex', require('knex')(require(`${process.cwd()}/knexfile.js`)[process.env.NODE_ENV]));
        this.set('schema', schema);
        this.set('event-handler.loader', eventHandlerLoader);
        this.set('response.handler', responseHandler);
        this.set('request.handler', requestHandler);
        this.set('repository.loader', repositoryLoader);
        this.set('data.handler', dataHandler);
        this.set('validation', validation);
        this.set('http', http);
        this.set('bus', bus);
    }

    get(name) {
        if(this.services.has(name)) return this.services.get(name);
        return false;
    }

    set(name, singleton) {
        this.services.set(name, singleton)
    }
}

const singleton = new ServiceManager;
module.exports.ServiceManager = ServiceManager;
module.exports = singleton;