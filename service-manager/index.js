const repositoryLoader = require('../repository-loader');
const dataHandler = require('../data-handler');
const validation = require('../validation');
const http = require('../http');
const bus = require('../bus');
const eventHandlerLoader = require('../event-handler-loader');
const responseHandler = require('../response-rule-loader');
const requestHandler = require('../request-rule-loader');
const entityLoader = require('../entity-loader');
const entityManager = require('../entity-manager');
const knex = require('../knex');

class ServiceManager {

    constructor() {
        this.services = new Map();
        this.set('knex', knex);
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
        switch(name) {
            case 'entity.manager': return new entityManager();
            case 'knex': return this.services.get('knex');
            case 'schema': return this.services.get('schema');
            case 'event-handler.loader': return this.services.get('event-handler.loader');
            case 'response.handler': return this.services.get('response.handler');
            case 'request.handler': return this.services.get('request.handler');
            case 'repository.loader': return this.services.get('repository.loader');
            case 'data.handler': return this.services.get('data.handler');
            case 'validation': return this.services.get('validation');
            case 'http': return this.services.get('http');
            case 'bus': return bus;
            default:
                return null;
        }
    }

    set(name, singleton) {
        this.services.set(name, singleton)
    }
}

const singleton = new ServiceManager;
module.exports.ServiceManager = ServiceManager;
module.exports = singleton;