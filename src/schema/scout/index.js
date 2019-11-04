const serviceManager = require('../../service-manager');
const Table = require('../table');
const columnFactory = require('../column/factory');
const schema = require('../index');

class SchemaScout {
    constructor() {
    }

    peak() {
        return new Promise(resolve => {
            let knex = serviceManager.get('knex');

            return knex('information_schema.tables').select()
                .where('table_schema', 'public')
                .then((existedTables) => {
                    let qs = [];
                    existedTables.forEach(table => {
                        let tableInfo = new Table(table.table_name);
                        schema.setTable(table.table_name, tableInfo);
                        let q = new Promise((resolve) => {
                            this.getColumnsInTable(table.table_name).then(resolve);
                        });
                        qs.push(q);
                    });
                    return Promise.all(qs).then(() => {
                        resolve();
                    });
                })
                .catch(() => {
                    resolve();
                })
        })
    }

    getColumnsInTable(tableName) {
        return new Promise(resolve => {
            let knex = serviceManager.get('knex');
            let constraints = new Map();
            knex('information_schema.columns')
                .select()
                .where('table_name', tableName)
                .then((existedColumns) => {
                    existedColumns.forEach((column) => {
                        let columnInfo = columnFactory(column.column_name, column.data_type);
                        columnInfo.setColumnInfo(column);
                        schema.setColumn(tableName, column.column_name, columnInfo);
                    });
                })
                .then(() => {
                    return knex('information_schema.table_constraints')
                        .select()
                        .where('table_name', tableName)
                })
                .then((existedConstraints) => {
                    existedConstraints.forEach(constraint => {
                        constraints.set(constraint.constraint_name, constraint);
                    })
                })
                .then(() => {
                    return knex('information_schema.constraint_column_usage')
                        .select()
                        .where('table_name', tableName);
                })
                .then((usage) => {
                    usage.forEach(u => {
                        let column = schema.getColumn(tableName, u.column_name);
                        column.setConstraint(constraints.get(u.constraint_name));
                    });
                })
                .then(resolve);
        })
    }
}

const singleton = new SchemaScout();
module.exports = singleton;