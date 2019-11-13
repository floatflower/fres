const serviceManager = require('./src/service-manager');

const EventHandler = require('./src/event-handler');
const Repository = require('./src/repository');
const RequestRule = require('./src/request-rule');
const ResponseRule = require('./src/response-rule');
const HttpError = require('./src/error/http');
const RepositoryError = require('./src/error/repository');
const RequestHandlerError = require('./src/error/request-handler');
const ResponseHandlerError = require('./src/error/response-handler');
const schemaScout = require('./src/schema/scout');
const validation = require('./src/validation');

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
                    let responseHandlerConstructor = require(`${path}/${file}`);
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
                    let requestHandlerConstructor = require(`${path}/${file}`);
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
                    let eventHandlerConstructor = require(`${path}/${file}`);
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