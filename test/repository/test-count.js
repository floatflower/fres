const schemaScout = require('../../schema/scout');
const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const Repository = require('../../repository');

describe('Test Repository count()', () => {

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

    it('能夠計算符合條件資料的數量。', (done) => {
        let repository = new Repository('test_entity');

        repository.count({
            duplicated_data: 'duplicated2'
        })
        .then((result) => {
            assert(result === 2, '數量計算錯誤。');
            done();
        })
    });

    it('傳入 trx 並以 share 為鎖定型態，能夠計算符合條件資料的數量。', (done) => {
        let repository = new Repository('test_entity');

        let result = 0;
        knex.transaction(trx => {
            repository.count({
                duplicated_data: 'duplicated2'
            }, trx)
            .then((countResult) => {result = countResult;})
            .then(trx.commit)
            .then(() => {
                assert(result === 2, '數量計算錯誤。');
                done();
            })
        });

    });

    it('傳入 trx 並以 update 為鎖定型態，能夠計算符合條件資料的數量。', (done) => {
        let repository = new Repository('test_entity');

        let result = 0;
        knex.transaction(trx => {
            repository.count({
                duplicated_data: 'duplicated2'
            }, trx)
            .then((countResult) => {result = countResult;})
            .then(trx.commit)
            .then(() => {
                assert(result === 2, '數量計算錯誤。');
                done();
            })
        });
    })

});