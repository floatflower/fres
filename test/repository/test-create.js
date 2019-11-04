const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const serviceManager = require('../../src/service-manager');
const schemaScout = require('../../src/schema/scout');

describe('Test Repository create()', () => {

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

    it('能夠創建資料', (done) => {
        let repository = serviceManager.get('repository.loader').basic('test_entity');

        repository.create({
            unique_data: 'unique1000',
            duplicated_data: 'duplicated3',
            create_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }).then((createdEntity) => {
            assert(createdEntity.id === 6, '實體主鍵錯誤。');
            assert(createdEntity.unique_data === 'unique1000', '插入的資料錯誤。');
            assert(createdEntity.duplicated_data === 'duplicated3', '插入的資料錯誤。');
            done();
        })
    });

    it('送入trx後，能夠創建資料', (done) => {
        let repository = serviceManager.get('repository.loader').basic('test_entity');

        let entity = null;
        knex.transaction(trx => {
            repository.create({
                unique_data: 'unique1000',
                duplicated_data: 'duplicated3',
                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }, trx)
            .then((createdEntity) => {
                entity = createdEntity;
            })
            .then(trx.commit)
            .then(() => {
                assert(entity.id === 6, '實體主鍵錯誤。');
                assert(entity.unique_data === 'unique1000', '插入的資料錯誤。');
                assert(entity.duplicated_data === 'duplicated3', '插入的資料錯誤。');
                done();
            })
        })

    })

});