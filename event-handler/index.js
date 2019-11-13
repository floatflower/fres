const bus = require('../bus');

class EventHandler
{
    constructor(name ,eventsToListen, type = 'forever') {
        this.name = name;
        this.events = [];
        this.type = ['forever', 'once'].includes(type) ? type : 'forever';
        this.subscribe(eventsToListen);
    }

    listenToEvent(event) {
        if(!this.events.includes(event)) {
            this.type === 'forever' ? bus.on(event, this.handle) : bus.once(event, this.handle);
            this.events.push(event);
        }
    }

    stopListenToEvent(event) {
        if(this.events.includes(event)) {
            bus.removeListener(event, this.handle);
            this.events.splice(this.events.indexOf(event), 1);
        }
    }

    subscribe(eventsToListen) {
        Array.isArray(eventsToListen) ?
            this.events.forEach(event => this.listenToEvent(event)) :
            this.listenToEvent(eventsToListen);
    }

    unsubscribe(events) {
        Array.isArray(events) ?
            this.events.forEach(event => this.stopListenToEvent(event)) :
            this.listenToEvent(events);
    }

    /**
     * 在 WebEngine 應用程式中，觀察者模式的發送者最好都可以將資料封裝成一個 Object 之後再拋出，
     * 因為不同數量的參數，若想要讓一個 EventHandler 註冊監聽不同的事件，就有可能造成參數數量不同，
     * 而產生應用程式的不一致。
     * @param payload
     */
    handle(payload) {

    }
}

module.exports = EventHandler;