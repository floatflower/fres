const fs = require('fs');
const path = require('path');

const serviceManager = require('./service-manager');

const EventHandler = require('./event-handler');
const Repository = require('./repository');
const Entity = require('./entity');
const RequestRule = require('./request-rule');
const ResponseRule = require('./response-rule');
const requestRuleLoader = require('./request-rule-loader');
const responseRuleLoader = require('./response-rule-loader');
const HttpError = require('./error/http');
const RepositoryError = require('./error/repository');
const RequestHandlerError = require('./error/request-handler');
const ResponseHandlerError = require('./error/response-handler');
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
                    let responseRuleConstructor = require(`${responseRuleDirectory}/${file}`);
                    if(validation.isConstructor(responseRuleConstructor)) {
                        let rootInstance = new responseRuleConstructor();
                        if(rootInstance instanceof ResponseRule) {
                            responseRuleLoader.set(responseRuleConstructor);
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
                    let requestRuleConstructor = require(`${requestRuleDirectory}/${file}`);
                    if(validation.isConstructor(requestRuleConstructor)) {
                        let rootInstance = new requestRuleConstructor();
                        if(rootInstance instanceof ResponseRule) {
                            requestRuleLoader.set(requestRuleConstructor);
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
                                .get('repository.loader')
                                .set(repositoryConstructor);
                        }
                    }
                }
            });
            resolve();
        });
    }

    initEntityLoader() {
        return new Promise((resolve, reject) => {
            let entityDirectory = `${process.cwd()}/src/entity`;
            let filesList = fs.readdirSync(entityDirectory);
            filesList.forEach(file => {
                if(fs.statSync(`${entityDirectory}/${file}`).isFile()) {
                    let entityConstructor = require(`${entityDirectory}/${file}`);
                    if(validation.isConstructor(entityConstructor)) {
                        let rootInstance = new entityConstructor();
                        if(rootInstance instanceof Entity) {
                            this
                                .serviceManager
                                .get('entity.loader')
                                .set(entityConstructor);
                        }
                    }
                }
            });
            resolve();
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