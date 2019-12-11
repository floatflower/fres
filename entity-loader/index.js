const validation = require('../validation');

class EntityLoader {
    constructor() {
        this.entities = new Map();
    }

    basic(tableName) {
        const Entity = require('../entity');
        return new Entity(tableName);
    }

    set(con) {
        if(validation.isConstructor(con)) {
            const Entity = require('../entity');
            let rootInstance = new con();
            if(rootInstance instanceof Entity)
                this.entities.set(rootInstance.tableName, con);
        }
    }

    get(table_name) {
        if(this.entities.has(table_name))
            return new (this.entities.get(table_name));
        else
            return this.basic(table_name);
    }
}

const singleton = new EntityLoader();
module.exports = singleton;