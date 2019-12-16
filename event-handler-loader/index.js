const fs = require('fs');
const validation = require('../validation');
const EventHandler = require('../event-handler');

class EventHandlerLoader
{
    constructor()
    {
        this.handlers = new Map();
    }

    init() {
        let eventHandlerDirectory = `${process.cwd()}/src/event-handler`;
        if(fs.existsSync(eventHandlerDirectory)) {
            let filesList = fs.readdirSync(eventHandlerDirectory);
            filesList.forEach(file => {
                if (fs.statSync(`${eventHandlerDirectory}/${file}`).isFile()) {
                    let eventHandlerConstructor = require(`${eventHandlerDirectory}/${file}`);
                    if (validation.isConstructor(eventHandlerConstructor)) {
                        let rootInstance = new eventHandlerConstructor();
                        if (rootInstance instanceof EventHandler) {
                            this.set(eventHandlerConstructor);
                        }
                    }
                }
            });
        }
    }

    set(con) {
        if(validation.isConstructor(con)) {
            const eventHandler = con();
            if (eventHandler instanceof EventHandler) {
                this.handlers.set(eventHandler.name, eventHandler);
            }
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
singleton.init();
module.exports = singleton;