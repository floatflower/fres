class Table
{
    constructor(name) {
        this.columns = new Map();
        this.name = name;
    }

    get(columnName) {
        if(this.columns.has(columnName)) return this.columns.get(columnName);
        else return null;
    }

    getPrimaryColumn() {
        this.columns.forEach(column => {
            if(column.isPrimary) return column;
        });
        return null;
    }
}

module.exports = Table;