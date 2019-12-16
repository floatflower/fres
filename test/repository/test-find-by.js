const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const Repository = require('../../repository');
const tableLoader = require('../../table-loader');

const Table = require('../../table');

class TestEntityTable extends Table {
    constructor() {
        super('test_entity');
        this.addColumn('id', 'integer', false, true, false);
        this.addColumn('unique_data', 'string', false, false, true);
        this.addColumn('duplicated_data', 'string', false, false, false);
        this.addColumn('create_at', 'datetime', false, false, false);
    }
}

describe('Test Repository findBy()', () => {
    before(() => {
        tableLoader.set(TestEntityTable);
    });

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
                .then(resolve, reject);
        });
    });

    afterEach(() => {
        return knex.schema.dropTable('test_entity');
    });

    it('在找不到任何符合條件的資料時，返回空陣列。', (done) => {
        let repository = new Repository('test_entity');

        repository.findBy({duplicated_data: 'duplicated100'})
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 0, '在找不到資料時應為空陣列。');
                done();
            })
    });

    it('找到符合條件的資料時，返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        repository.findBy({duplicated_data: 'duplicated1'})
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 3, '回傳資料筆數不正確。');
                done();
            })
    });

    it('找到符合條件時，透過 limit 及 offset 切分資料。', (done) => {
        let repository = new Repository('test_entity');

        repository.findBy(
            {duplicated_data: 'duplicated1'}, {}, 2, 1)
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 2, '回傳資料筆數不正確。');
                done();
            })
    });

    it('找到符合條件的資料時，透過 orderBy 進行排序，並返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        repository.findBy(
            {duplicated_data: 'duplicated1'}, {id: 'ASC'})
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 3, '回傳資料筆數不正確。');
                assert(existedEntity[0].id === 1, '排序資料錯誤。');
                assert(existedEntity[1].id === 2, '排序資料錯誤。');
                assert(existedEntity[2].id === 4, '排序資料錯誤。');
                done();
            })
    });

    it('找到符合條件的資料時，透過 orderBy 進行排序、透過 limit 及 offset 切分資料，並返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        repository.findBy(
            {duplicated_data: 'duplicated1'}, {id: 'ASC'}, 2, 1)
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 2, '回傳資料筆數不正確。');
                assert(existedEntity[0].id === 2, '排序資料錯誤。');
                assert(existedEntity[1].id === 4, '排序資料錯誤。');
                done();
            })
    });

    it('傳入 trx 並以 share 為鎖定型態，在找不到任何符合條件的資料時，返回空陣列。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated100'},
                {},
                null,
                null,
                trx,
                'share'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 0, '在找不到資料時應為空陣列。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 share 為鎖定型態，找到符合條件的資料時，返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated1'},
                {},
                null,
                null,
                trx,
                'share'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 3, '回傳資料筆數不正確。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 share 為鎖定型態，找到符合條件時，透過 limit 及 offset 切分資料。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated1'},
                {},
                2,
                1,
                trx,
                'share'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 2, '回傳資料筆數不正確。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 share 為鎖定型態，找到符合條件的資料時，透過 orderBy 進行排序，並返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated1'},
                {},
                null,
                null,
                trx,
                'share'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 3, '回傳資料筆數不正確。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 share 為鎖定型態，找到符合條件的資料時，透過 orderBy 進行排序、透過 limit 及 offset 切分資料，並返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated1'},
                {id: 'ASC'},
                2,
                1,
                trx,
                'share'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 2, '回傳資料筆數不正確。');
                assert(existedEntity[0].id === 2, '排序資料錯誤。');
                assert(existedEntity[1].id === 4, '排序資料錯誤。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 update 為鎖定型態，在找不到任何符合條件的資料時，返回空陣列。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated100'},
                {},
                null,
                null,
                trx,
                'update'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 0, '在找不到資料時應為空陣列。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 update 為鎖定型態，找到符合條件的資料時，返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated1'},
                {},
                null,
                null,
                trx,
                'update'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 3, '回傳資料筆數不正確。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 update 為鎖定型態，找到符合條件時，透過 limit 及 offset 切分資料。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated1'},
                {},
                2,
                1,
                trx,
                'update'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 2, '回傳資料筆數不正確。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 update 為鎖定型態，找到符合條件的資料時，透過 orderBy 進行排序，並返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated1'},
                {},
                null,
                null,
                trx,
                'update'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 3, '回傳資料筆數不正確。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

    it('傳入 trx 並以 update 為鎖定型態，找到符合條件的資料時，透過 orderBy 進行排序、透過 limit 及 offset 切分資料，並返回陣列。', (done) => {
        let repository = new Repository('test_entity');

        knex.transaction((trx) => {

            repository.findBy(
                {duplicated_data: 'duplicated1'},
                {id: 'ASC'},
                2,
                1,
                trx,
                'update'
            )
            .then((existedEntity) => {
                assert(Array.isArray(existedEntity), '回傳值應該為陣列。');
                assert(existedEntity.length === 2, '回傳資料筆數不正確。');
                assert(existedEntity[0].id === 2, '排序資料錯誤。');
                assert(existedEntity[1].id === 4, '排序資料錯誤。');
            })
            .then(trx.commit)
            .then(() => {
                done();
            })
        });
    });

});