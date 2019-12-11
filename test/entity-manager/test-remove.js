const serviceManager = require('../../service-manager');
const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const entityLoader = require('../../entity-loader');
const Entity = require('../../entity');

class TestEntity extends Entity {
    constructor() {
        super('test_entity');
        this.addColumn('id', 'integer', false, true, false);
        this.addColumn('unique_data', 'string', false, false, true);
        this.addColumn('duplicated_data', 'string', false, false, false);
        this.addColumn('create_at', 'datetime', false, false, false);
        this.beforeCreate.push(this.setCreateAt);
    }

    setCreateAt(ref) {
        ref.set('create_at', moment().format('YYYY-MM-DD HH:mm:ss'));
    }
}

describe('Test EntityManager persist()', () => {

    beforeEach(() => {
        entityLoader.set(TestEntity);
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
                            }
                        ])
                })
                .then(resolve, reject);
        });
    });

    afterEach(() => {
        return knex.schema.dropTable('test_entity');
    });

    it('can remove entity', (done) => {
        const entityManager = serviceManager.get('entity.manager');
        const repositoryLoader = serviceManager.get('repository.loader');
        const testEntityRepository = repositoryLoader.basic('test_entity');

        testEntityRepository.findOneBy({id: 1})
            .then(async (existedEntity) => {
                await entityManager.remove(existedEntity);
                await entityManager.flush();
            })
            .then(() => testEntityRepository.findOneBy({id: 1}))
            .then((existedEntity) => {
                assert(existedEntity === null, '刪除失敗');
                done();
            })
    });

    it('can remove multiple entities', (done) => {
        const entityManager = serviceManager.get('entity.manager');
        const repositoryLoader = serviceManager.get('repository.loader');
        const testEntityRepository = repositoryLoader.basic('test_entity');

        testEntityRepository.findOneBy({id: 1})
            .then(async (existedEntity) => {
                await entityManager.remove(existedEntity);
            })
            .then(() => testEntityRepository.findOneBy({id: 2}))
            .then(async (existedEntity) => {
                await entityManager.remove(existedEntity);
            })
            .then(() => entityManager.flush())
            .then(() => testEntityRepository.findOneBy({id: 1}))
            .then((existedEntity) => {
                assert(existedEntity === null, '刪除失敗');
            })
            .then(() => testEntityRepository.findOneBy({id: 2}))
            .then((existedEntity) => {
                assert(existedEntity === null, '刪除失敗');
                done();
            })
    })
});