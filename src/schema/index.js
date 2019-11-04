class Schema
{
    constructor() {
        this.tables = new Map();
    }

    getTable(tableName) {
        if(this.tables.has(tableName)) return this.tables.get(tableName);
        else return null;
    }

    getColumn(tableName, columnName) {
        if(this.tables.has(tableName) && this.tables.get(tableName).columns.has(columnName))
            return this.tables.get(tableName).columns.get(columnName);
        else return null;
    }

    setTable(tableName, table) {
        if(!this.tables.has(tableName)) this.tables.set(tableName, table);
    }

    setColumn(tableName, columnName, column) {
        if(this.tables.has(tableName)
            && !this.tables.get(tableName).columns.has(columnName))
            this.tables.get(tableName).columns.set(columnName, column);
    }
}

const singleton = new Schema();
module.exports.Schema = Schema;
module.exports = singleton;