const fs = require('fs');
const validation = require('../validation');
const Table = require('../table');

class TableLoader
{
    constructor() {
        this.tables = new Map();
    }

    init() {
        let tableDirectory = `${process.cwd()}/src/table`;
        if(fs.existsSync(tableDirectory)) {
            let filesList = fs.readdirSync(tableDirectory);
            filesList.forEach(file => {
                if (fs.statSync(`${tableDirectory}/${file}`).isFile()) {
                    let tableConstructor = require(`${tableDirectory}/${file}`);
                    if (validation.isConstructor(tableConstructor)) {
                        let rootInstance = new tableConstructor();
                        if (rootInstance instanceof Table) {
                            this.set(tableConstructor);
                        }
                    }
                }
            });
        }
    }

    set(con)
    {
        if(validation.isConstructor(con)) {
            const Table = require('../table');
            let rootInstance = new con();
            if(rootInstance instanceof Table)
                this.tables.set(rootInstance.name, con);
        }
    }

    get(name) {
        if(this.tables.has(name)) return new (this.tables.get(name))();
        return null;
    }
}

const singleton = new TableLoader();
singleton.init();
module.exports = singleton;