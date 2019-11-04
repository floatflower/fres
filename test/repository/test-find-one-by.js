const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const Repository = require('../../src/repository');
const schemaScout = require('../../src/schema/scout');

describe('Test Repository findOneBy()', () => {

    beforeEach(() => {
        // create table
        return new Promise((resolve, reject) => {
            return knex.schema
                .createTable('test_entity', (table) => {

                    table
                        .increments('id')
                        .primary()
                        .notNullable()
                        .unsigned();

                    table
                        .string('unique_data')
                        .unique()
                        .notNullable()
                        .collate('utf8mb4_unicode_ci');

                    table
                        .string('duplicated_data')
                        .notNullable()
                        .collate('utf8mb4_unicode_ci');

                    table
                        .dateTime('create_at')
                        .notNullable()
                        .collate('utf8mb4_unicode_ci');

                })
                .then(() => {
                    return knex('test_entity')
                        .insert([
                            // 1
                            {
                                unique_data: 'unique1',
                                duplicated_data: 'duplicated',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 2
                            {
                                unique_data: 'unique2',
                                duplicated_data: 'duplicated',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 3
                            {
                                unique_data: 'unique3',
                                duplicated_data: 'duplicated',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 4
                            {
                                unique_data: 'unique4',
                                duplicated_data: 'duplicated',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 5
                            {
                                unique_data: 'unique5',
                                duplicated_data: 'duplicated',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                        ])
                })
                .then(() => schemaScout.peak())
                .then(resolve, reject);
        });
    });

    afterEach(() => {
        return knex.schema.dropTable('test_entity');
    });

    it('在找不到資料時，從 findOneBy() 中取得 null。', (done) => {
        let repository = new Repository('test_entity');

        repository.findOneBy({id: 100})
            .then((existedEntity) => {
                assert(existedEntity === null, '找不到資料時應該為 null。');
                done();
            })
    });

    it('在找到資料時，從 findOneBy() 中取得指定資料。', (done) => {
        let repository = new Repository('test_entity');

        repository.findOneBy({id: 1})
            .then((existedEntity) => {
                assert(existedEntity.id === 1, '找到的指定資料不符合需求。');
                done();
            })
    });

    it('在符合找尋條件超過一筆時，僅回傳一筆資料。', (done) => {
        let repository = new Repository('test_entity');

        repository.findOneBy({duplicated_data: 'duplicated'})
            .then((existedEntity) => {
                assert(!Array.isArray(existedEntity), '找到的資料超過一筆時應該只回傳一筆。');
                done();
            })
    });

    it('傳入 trx 並以 share 為鎖定型態，且在找不到資料時，從 findOneBy() 中取得 null。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction(trx => {
            repository.findOneBy({id: 100}, trx, 'share')
                .then((existedEntity) => {
                    assert(existedEntity === null, '找不到資料時應該為 null。');
                })
                .then(trx.commit)
                .then(() => {
                    done();
                })
        })
    });

    it('傳入 trx 並以 share 為鎖定型態，在找到資料時，從 findOneBy() 中取得指定資料。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction(trx => {
            repository.findOneBy({id: 1}, trx, 'share')
                .then((existedEntity) => {
                    assert(existedEntity.id === 1, '找到的指定資料不符合需求。');
                })
                .then(trx.commit)
                .then(() => {
                    done();
                })
        })
    });

    it('傳入 trx 並以 share 為鎖定型態，在符合找尋條件超過一筆時，僅回傳一筆資料。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction(trx => {
            repository.findOneBy({duplicated_data: 'duplicated'}, trx, 'share')
                .then((existedEntity) => {
                    assert(!Array.isArray(existedEntity), '找到的資料超過一筆時應該只回傳一筆。');
                })
                .then(trx.commit)
                .then(() => {
                    done();
                })
        })
    });

    it('傳入 trx 並以 update 為鎖定型態，且在找不到資料時，從 findOneBy() 中取得 null。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction(trx => {
            repository.findOneBy({id: 100}, trx, 'update')
                .then((existedEntity) => {
                    assert(existedEntity === null, '找不到資料時應該為 null。');
                })
                .then(trx.commit)
                .then(() => {
                    done();
                })
        })
    });

    it('傳入 trx 並以 update 為鎖定型態，在找到資料時，從 findOneBy() 中取得指定資料。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction(trx => {
            repository.findOneBy({id: 1}, trx, 'update')
                .then((existedEntity) => {
                    assert(existedEntity.id === 1, '找到的資料超過一筆時應該只回傳一筆。');
                })
                .then(trx.commit)
                .then(() => {
                    done();
                })
        })
    });

    it('傳入 trx 並以 update 為鎖定型態，在符合找尋條件超過一筆時，僅回傳一筆資料。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction(trx => {
            repository.findOneBy({duplicated_data: 'duplicated'}, trx, 'update')
                .then((existedEntity) => {
                    assert(!Array.isArray(existedEntity), '找到的資料超過一筆時應該只回傳一筆。');
                })
                .then(trx.commit)
                .then(() => {
                    done();
                })
        })
    });
});