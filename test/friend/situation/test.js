const moment = require('moment');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;

const knexConfig = require('../../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);

const Situation = require('../../../friend/situation');
let situation = new Situation();

let seeder1 = (knex) => {
    return knex('test').insert({a: 1, b: 2})
};

let seeder2 = (knex) => {
    return knex('test1').insert({test_a: 1})
};

situation.register(seeder1);
situation.register(seeder2);

describe('Test Situation', () => {

    beforeEach(() => {
        return new Promise((resolve) => {
            knex.schema.createTable('test', (table) => {
                table.integer('a').primary();
                table.integer('b');
            })
            .then(() => {
                return knex.schema.createTable('test1', (table) => {
                    table
                        .integer('test_a')
                        .references('a')
                        .inTable('test')
                        .unsigned()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE')
                        .collate('utf8mb4_unicode_ci');
                })
            })
            .then(resolve);
        })
    });

    afterEach(() => {
        return new Promise((resolve) => {
            knex.schema.dropTableIfExists('test1').then(() => {
                return knex.schema.dropTableIfExists('test')
            })
            .then(() => {resolve()});
        })
    });

    it('測試能正常插入表格', (done) => {
        situation.build()
            .then(() => {
                return knex('test').select()
                    .then((results) => {
                        assert(results.length === 1, '插入資料失敗');
                        assert(results[0].a === 1, '插入資料失敗');
                        assert(results[0].b === 2, '插入資料失敗');
                        done();
                    })
            })
    });

    it('測試能插入外鍵，能插入代表順序正確', (done) => {
        situation.build()
            .then(() => {
                return knex('test1').select()
                    .then((results) => {
                        assert(results.length === 1, '插入資料失敗');
                        assert(results[0].test_a === 1, '插入資料失敗');
                        done();
                    })
            })
    });
});