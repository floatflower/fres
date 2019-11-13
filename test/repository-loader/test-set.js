const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const Repository = require('../../repository');
const serviceManager = require('../../service-manager');

class TestRepository extends Repository
{
    constructor() {
        super('test');
    }
}

describe('Test RepositoryLoader set()', () => {

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

    it('能夠將 Repository 的 constructor 載入 Loader 中。', (done) => {
        let repositoryLoader = serviceManager.get('repository.loader');
        repositoryLoader.set(TestRepository);
        assert(typeof repositoryLoader.repositories.has('test'), '沒有成功插入。');
        assert(typeof repositoryLoader.get('test') === 'object', '插入的型態錯誤。');
        done();
    });

});