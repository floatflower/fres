const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const Repository = require('../../repository');
const schemaScout = require('../../schema/scout');

describe('Test Repository update()', () => {

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
                        .string('editable_data')
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
                                editable_data: 'uneditted',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 2
                            {
                                unique_data: 'unique2',
                                duplicated_data: 'duplicated1',
                                editable_data: 'uneditted',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 3
                            {
                                unique_data: 'unique3',
                                duplicated_data: 'duplicated2',
                                editable_data: 'uneditted',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 4
                            {
                                unique_data: 'unique4',
                                duplicated_data: 'duplicated1',
                                editable_data: 'uneditted',
                                create_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 5
                            {
                                unique_data: 'unique5',
                                duplicated_data: 'duplicated2',
                                editable_data: 'uneditted',
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

    it('在送入空物件時不會發生錯誤，函數將會忽略這筆呼叫。', (done) => {
        let repository = new Repository('test_entity');

        repository.update({id: 1}, {})
            .then(() => {
                done();
            })
    });

    it('可以更新指定的 Row。', (done) => {
        let repository = new Repository('test_entity');

        repository.update({id: 1}, {
            unique_data: 'unique1000'
        })
        .then(() => {
            return knex('test_entity').select().where('id', 1)
                .then((existedEntity) => {
                    assert(existedEntity[0].unique_data === 'unique1000', '更新失敗');
                    done();
                });
        })
    });

    it('可以更新多筆指定的 Raw。', (done) => {
        let repository = new Repository('test_entity');

        repository.update({duplicated_data: 'duplicated1'}, {
            editable_data: 'editted'
        })
        .then(() => {
            return knex('test_entity')
                .select()
                .then((existedEntity) => {
                    existedEntity.forEach(entity => {
                        if(entity.duplicated_data === 'duplicated1') {
                            assert(entity.editable_data === 'editted', '更新失敗');
                        } else if(entity.duplicated_data === 'duplicated2') {
                            assert(entity.editable_data === 'uneditted', '異動到非指定資料 Row。');
                        }
                    });
                    done();
                });
        })
    });

    it('送入 trx 時，在送入空物件時不會發生錯誤，函數將會忽略這筆呼叫。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {
            return repository.update({id: 1}, {}, trx)
                .then(trx.commit)
                .then(() => {
                    done();
                })
        })
    });

    it('送入 trx 時，可以更新指定的 Row。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {
            return repository.update({id: 1}, {
                unique_data: 'unique1000'
            }, trx)
            .then(trx.commit)
            .then(() => {
                return knex('test_entity').select().where('id', 1)
                    .then((existedEntity) => {
                        assert(existedEntity[0].unique_data === 'unique1000', '更新失敗');
                        done();
                    });
            })
        })

    });

    it('送入 trx 時，可以更新多筆指定的 Raw。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {
            return repository.update({duplicated_data: 'duplicated1'}, {
                editable_data: 'editted'
            }, trx)
            .then(trx.commit)
            .then(() => {
                return knex('test_entity')
                    .select()
                    .then((existedEntity) => {
                        existedEntity.forEach(entity => {
                            if(entity.duplicated_data === 'duplicated1') {
                                assert(entity.editable_data === 'editted', '更新失敗');
                            } else if(entity.duplicated_data === 'duplicated2') {
                                assert(entity.editable_data === 'uneditted', '異動到非指定資料 Row。');
                            }
                        });
                        done();
                    });
            })
        })

    });

});

