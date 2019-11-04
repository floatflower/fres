const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const serviceManager = require('../../src/service-manager');
const Repository = require('../../src/repository');

describe('Test RepositoryLoader basic()', () => {

    beforeEach(() => {
        return new Promise(resolve => {
            knex.schema.createTable('test', (table) => {
                table
                    .increments('id')
                    .primary()
                    .notNullable()
                    .unsigned();
                table
                    .dateTime('create_at')
                    .notNullable()
                    .collate('utf8mb4_unicode_ci');
            })
                .then(resolve);
        })
    });
    afterEach(() => {
        return new Promise(resolve => {
            knex.schema.dropTable('test').then(resolve);
        });
    });

    it('能夠取得一個基礎的 Repository 實例。', (done) => {
        let testRepository = serviceManager.get('repository.loader').basic('test');
        assert(testRepository instanceof Repository, '回傳型態錯誤。');
        done();
    });

});