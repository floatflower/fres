const EventHandler = require('../event-handler');

class EventHandlerLoader
{
    constructor()
    {
        this.handlers = new Map();
    }

    set(eventHandler) {
        if(eventHandler instanceof EventHandler) {
            this.handlers.set(eventHandler.name, eventHandler);
        }
    }

    get(name) {
        if(this.handlers.has(name)) {
            return this.handlers.get(name);
        }
        return null;
    }
}

const singleton = new EventHandlerLoader();
module.exports.EventHandlerLoader = EventHandlerLoader;
module.exports = singleton;