const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const Repository = require('../../repository');
const schemaScout = require('../../schema/scout');

describe('Test Repository remove()', () => {

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
                                duplicated_data: 'duplicated1',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 2
                            {
                                unique_data: 'unique2',
                                duplicated_data: 'duplicated1',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 3
                            {
                                unique_data: 'unique3',
                                duplicated_data: 'duplicated2',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 4
                            {
                                unique_data: 'unique4',
                                duplicated_data: 'duplicated1',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 5
                            {
                                unique_data: 'unique5',
                                duplicated_data: 'duplicated2',
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

    it('可刪除一筆資料', (done) => {

        let repository = new Repository('test_entity');

        repository.remove({id: 1})
            .then(() => {
                knex('test_entity')
                    .select()
                    .where('id', 1)
                    .then((existedEntity) => {
                        assert(existedEntity.length === 0, '資料沒有被正確刪除');
                        done();
                    })
            })

    });

    it('可刪除多筆資料', (done) => {
        let repository = new Repository('test_entity');

        repository.remove({unique_data: 'unique1'})
            .then(() => {
                knex('test_entity')
                    .select()
                    .where('unique_data', 'unique1')
                    .then((existedEntity) => {
                        assert(existedEntity.length === 0, '資料沒有被正確刪除');
                        done();
                    })
            })
    });

    it('當傳入 trx 時，可以刪除一筆資料', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {
            repository.remove({id: 1}, trx)
                .then(trx.commit)
                .then(() => {
                    return knex('test_entity')
                        .select()
                        .where('id', 1)
                        .then((existedEntity) => {
                            assert(existedEntity.length === 0, '資料沒有被正確刪除');
                            done();
                        });
                })
        })
    });

    it('當傳入 trx 時，可以刪除多筆資料', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {
            repository.remove({unique_data: 'unique1'}, trx)
                .then(trx.commit)
                .then(() => {
                    return knex('test_entity')
                        .select()
                        .where('unique_data', 'unique1')
                        .then((existedEntity) => {
                            assert(existedEntity.length === 0, '資料沒有被正確刪除');
                            done();
                        })
                })
        })
    });

});