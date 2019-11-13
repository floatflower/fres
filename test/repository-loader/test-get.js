const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const serviceManager = require('../../service-manager');
const Repository = require('../../repository');

class TestRepository extends Repository
{
    constructor() {
        super('test');
    }
}

describe('Test RepositoryLoader get()', () => {

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

    it('能夠透過 get() 函數取得 RepositoryLoader 中的 Repository 實例。', (done) => {
        serviceManager.get('repository.loader').set(TestRepository);
        let testRepository = serviceManager.get('repository.loader').get('test');
        assert(testRepository instanceof TestRepository, '取得型態錯誤。');
        done();
    });

    it('若嘗試取得不存在的 Repository 時，將從函數中取得基礎的 Repository 類。', (done) => {
        let nonExistedRepository = serviceManager.get('repository.loader').get('non-existed');
        assert(nonExistedRepository instanceof Repository, '回傳內容應該回 null。');
        done();
    })

});