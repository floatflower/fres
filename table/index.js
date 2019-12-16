class Table {
    constructor(name) {
        this.name = name;
        this.columns = new Map();
    }

    addColumn(name, type, nullable = true, isPrimary = false, isUnique = false) {
        this.columns.set(name, {
            type: type,
            nullable: nullable,
            isPrimary: isPrimary,
            isUnique: isUnique
        });

        return this;
    }

    getColumn(name) {
        if(this.columns.has(name)) return this.columns.get(name);
        else return null;
    }
}

module.exports = Table;