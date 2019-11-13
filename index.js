const fs = require('fs');
const path = require('path');

const serviceManager = require('./service-manager');

const EventHandler = require('./event-handler');
const Repository = require('./repository');
const RequestRule = require('./request-rule');
const ResponseRule = require('./response-rule');
const HttpError = require('./error/http');
const RepositoryError = require('./error/repository');
const RequestHandlerError = require('./error/request-handler');
const ResponseHandlerError = require('./error/response-handler');
const schemaScout = require('./schema/scout');
const validation = require('./validation');

class Fres {
    constructor() {
        this.serviceManager = serviceManager;
    }

    initResponseHandler() {
        return new Promise((resolve) => {
            let responseRuleDirectory = `${process.cwd()}/src/response-rule`;
            let filesList = fs.readdirSync(responseRuleDirectory);
            filesList.forEach(file => {
                if(fs.statSync(`${responseRuleDirectory}/${file}`).isFile()) {
                    let responseHandlerConstructor = require(`${responseRuleDirectory}/${file}`);
                    if(validation.isConstructor(responseHandlerConstructor)) {
                        let rootInstance = new responseHandlerConstructor();
                        if(rootInstance instanceof ResponseRule) {
                            this
                                .serviceManager
                                .get('response.handler')
                                .set(responseHandlerConstructor);
                        }
                    }
                }
            });
            resolve();
        });
    }

    initRequestHandler() {
        return new Promise((resolve) => {
            let requestRuleDirectory = `${process.cwd()}/src/request-rule`;
            let filesList = fs.readdirSync(requestRuleDirectory);
            filesList.forEach(file => {
                if(fs.statSync(`${requestRuleDirectory}/${file}`).isFile()) {
                    let requestHandlerConstructor = require(`${requestRuleDirectory}/${file}`);
                    if(validation.isConstructor(requestHandlerConstructor)) {
                        let rootInstance = new requestHandlerConstructor();
                        if(rootInstance instanceof ResponseRule) {
                            this
                                .serviceManager
                                .get('response.handler')
                                .set(requestHandlerConstructor);
                        }
                    }
                }
            });
            resolve();
        });
    }

    initEventHandlerLoader() {
        return new Promise((resolve) => {
            let eventHandlerDirectory = `${process.cwd()}/src/event-handler`;
            let filesList = fs.readdirSync(eventHandlerDirectory);
            filesList.forEach(file => {
                if(fs.statSync(`${eventHandlerDirectory}/${file}`).isFile()) {
                    let eventHandlerConstructor = require(`${eventHandlerDirectory}/${file}`);
                    if(validation.isConstructor(eventHandlerConstructor)) {
                        let rootInstance = new eventHandlerConstructor();
                        if(rootInstance instanceof ResponseRule) {
                            this
                                .serviceManager
                                .get('response.handler')
                                .set(eventHandlerConstructor);
                        }
                    }
                }
            });
            resolve();
        });
    }

    initRepositoryLoader() {
        return new Promise((resolve) => {
            let repositoryDirectory = `${process.cwd()}/src/repository`;
            let filesList = fs.readdirSync(repositoryDirectory);
            filesList.forEach(file => {
                if(fs.statSync(`${repositoryDirectory}/${file}`).isFile()) {
                    let repositoryConstructor = require(`${repositoryDirectory}/${file}`);
                    if(validation.isConstructor(repositoryConstructor)) {
                        let rootInstance = new repositoryConstructor();
                        if(rootInstance instanceof Repository) {
                            this
                                .serviceManager
                                .get('response.handler')
                                .set(repositoryConstructor);
                        }
                    }
                }
            });
            resolve();
        });
    }

    initSchemaScout() {
        return new Promise((resolve, reject) => {
            schemaScout.peak().then(resolve, reject);
        });
    }
}

const fres = new Fres();
module.exports = fres;

exports.EventHandler = EventHandler;
exports.Repository = Repository;
exports.RequestRule = RequestRule;
exports.ResponseRule = ResponseRule;
exports.HttpError = HttpError;
exports.RepositoryError = RepositoryError;
exports.RequestHandlerError = RequestHandlerError;
exports.ResponseHandlerError = ResponseHandlerError;