const knex = require('../knex');
const repositoryLoader = require('../repository-loader');

let generateTrx = () => {
    return new Promise(resolve => {
        return knex.transaction(trx => {
            resolve(trx);
        })
    });
};

class Action {
    // action:
    // + create
    // + update
    // + remove
    constructor(action, entity) {
        this.action = action;
        this.entity = entity;
    }
}

class EntityManager {

    constructor() {
        this.actions = [];
    }

    persist(entity) {
        const primaryColumnValue = entity.get(entity.primary);
        // create new entity
        if(primaryColumnValue === null) {
            this.actions.push(new Action('create', entity));
        }
        // update existed entity
        else {
            this.actions.push(new Action('update', entity));
        }
        return this;
    }

    remove(entity) {
        this.actions.push(new Action('remove', entity));
    }

    async flush() {
        return new Promise(async resolve => {
            let error = false;
            return knex.transaction(async trx => {
                for(let i = 0; i < this.actions.length; i ++) {
                    if(this.actions[i].action === 'create') {
                        await this
                            .handleCreateEntity(this.actions[i].entity, trx)
                            .catch(() => {
                                error = true;
                            });
                    }

                    else if(this.actions[i].action === 'update') {
                        await this
                            .handleUpdateEntity(this.actions[i].entity, trx)
                            .catch(() => {
                                error = true;
                            });
                    }

                    else if(this.actions[i].action === 'remove') {
                        await this
                            .handleRemoveEntity(this.actions[i].entity, trx)
                            .catch(() => {
                                error = true;
                            });
                    }

                    if(error) break;
                }
                if(!error) {
                    return trx.commit().then(resolve);
                } else {
                    return trx.rollback().then(resolve);
                }
            })
        })

    }

    async handleCreateEntity(entity, trx) {
        return new Promise(async (resolve, reject) => {
            const repository = repositoryLoader
                .get(entity.tableName);

            await entity.callBeforeCreate();

            let entityData = {};
            for(let key of entity.columns.keys()) {
                if(key !== entity.primary) entityData[key] = entity.get(key)
            }

            const createdEntity = await repository
                .create(entityData, trx, entity.primary)
                .catch(reject);

            for(let [index, value] of createdEntity.data) {
                entity.set(index, value);
            }

            await entity.callAfterCreate();

            resolve(entity)
        });
    }

    async handleUpdateEntity(entity, trx) {
        const beforeUpdate = entity.beforeUpdate;
        const afterUpdate = entity.afterUpdate;

        return new Promise(async (resolve, reject) => {
            const repository = repositoryLoader
                .get(entity.tableName);

            let entityData = {};
            for(let key of entity.columns.keys()) {
                if(key !== entity.primary) entityData[key] = entity.get(key)
            }

            let criteria = {};
            criteria[entity.primary] = entity.get(entity.primary);

            for(let i = 0; i < beforeUpdate.length; i ++) {
                await (beforeUpdate[i])();
            }

            await repository.update(criteria, entityData, trx).catch(reject);
            const updatedEntity = await repository.findOneBy(criteria);

            for(let key of entity.columns.keys()) {
                if(typeof updatedEntity[key] !== 'undefined')
                    entity.set(key, updatedEntity[key]);
            }

            for(let i = 0; i < afterUpdate.length; i ++) {
                await (afterUpdate[i])();
            }

            resolve(entity);
        });
    }

    async handleRemoveEntity(entity, trx) {
        const beforeRemove = entity.beforeRemove;
        const afterRemove = entity.afterRemove;
        return new Promise(async (resolve, reject) => {
            const repository = repositoryLoader
                .get(entity.tableName);

            let criteria = {};
            criteria[entity.primary] = entity.get(entity.primary);

            for(let i = 0; i < beforeRemove.length; i ++) {
                await (beforeRemove[i])();
            }

            await repository.remove(criteria, trx).catch(reject);

            for(let i = 0; i < afterRemove.length; i ++) {
                await (afterRemove[i])();
            }

            resolve();
        });
    }
}

module.exports = EntityManager;