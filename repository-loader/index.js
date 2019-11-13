const validation = require('../validation');

class RepositoryLoader
{
    constructor() {
        this.repositories = new Map();
    }

    basic(tableName) {
        const Repository = require('../repository');
        return new Repository(tableName);
    }

    set(con)
    {
        if(validation.isConstructor(con)) {
            const Repository = require('../repository');
            let rootInstance = new con();
            if(rootInstance instanceof Repository) this.repositories.set(rootInstance.table, con);
        }
    }

    get(table_name) {
        if(this.repositories.has(table_name)) return new (this.repositories.get(table_name))();
        else return this.basic(table_name);
    }
}

const singleton = new RepositoryLoader();

module.exports.RepositoryLoader = RepositoryLoader;
module.exports = singleton;