const fs = require('fs');
const Repository = require('../repository');
const validation = require('../validation');

class RepositoryLoader
{
    constructor() {
        this.repositories = new Map();
    }

    init() {
        let repositoryDirectory = `${process.cwd()}/src/repository`;
        if(fs.existsSync(repositoryDirectory)) {
            let filesList = fs.readdirSync(repositoryDirectory);
            filesList.forEach(file => {
                if (fs.statSync(`${repositoryDirectory}/${file}`).isFile()) {
                    let repositoryConstructor = require(`${repositoryDirectory}/${file}`);
                    if (validation.isConstructor(repositoryConstructor)) {
                        let rootInstance = new repositoryConstructor();
                        if (rootInstance instanceof Repository) {
                            this.set(repositoryConstructor);
                        }
                    }
                }
            });
        }
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
            if(rootInstance instanceof Repository)
                this.repositories.set(rootInstance.table, con);
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