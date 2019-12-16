services = new Map();
services.set('knex', require('./knex'));
services.set('event-handler.loader', require('./event-handler-loader'));
services.set('response.handler', require('./response-handler'));
services.set('repository.loader', require('./repository-loader'));
services.set('view.data.provider.loader', require('./view-data-provider-loader'));
services.set('data.handler', require('./data-handler'));
services.set('validation', require('./validation'));
services.set('http', require('./http'));
services.set('bus', require('./bus'));


exports.get = (name) => {
    return services.get(name);
};

exports.EventHandler = require('./event-handler');
exports.Repository = require('./repository');
exports.ResponseRule = require('./response-rule');
exports.HttpError = require('./error/http');