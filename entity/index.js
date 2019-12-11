class Entity {
    constructor(tableName) {
        this.tableName = tableName;
        this.primary = null;
        this.columns = new Map();
        this.beforeUpdate = [];
        this.afterUpdate = [];
        this.beforeCreate = [];
        this.afterCreate = [];
        this.beforeRemove = [];
        this.afterRemove = [];
        this.data = new Map();
        this.isBasicEntity = true;
    }

    addColumn(name, type, nullable = true, primary = false, unique = false) {

        this.columns.set(name, {
            type: type,
            primary: primary,
            unique: unique,
            nullable: nullable
        });

        if(primary === true) {
            this.primary = name;
        }

        this.data.set(key, null);

        this.isBasicEntity = false;
        return this;
    }

    getColumn(name) {
        return this.columns.get(name);
    }

    set(key, value) {
        if(!this.isBasicEntity && this.columns.has(key)) {
            this.data.set(key, value);
        }
        return this;
    }

    get(key) {
        if(this.data.has(key)) return this.data.get(key);
        else return null;
    }

    addBeforeUpdate(func) {
        if(typeof func === 'function') {
            this.beforeUpdate.push(func);
        }

        return this;
    }

    addAfterUpdate(func) {
        if(typeof func === 'function') {
            this.afterUpdate.push(func);
        }

        return this;
    }

    addBeforeCreate(func) {
        if(typeof func === 'function') {
            this.beforeCreate.push(func);
        }

        return this;
    }

    addAfterCreate(func) {
        if(typeof func === 'function') {
            this.afterCreate.push(func);
        }

        return this;
    }

    handleRowData(data) {
        Object.keys(data).forEach(key => {
            this.set(key, data[key]);
        });
    }
}

module.exports = Entity;