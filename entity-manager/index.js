const serviceManager = require('../service-manager');

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
        return new Promise(resolve => {
            const knex = require('../knex');
            return knex.transaction(async trx => {
                for(let i = 0; i < this.actions.length; i ++) {
                    let action = this.actions[i];
                    let entity = action.entity;
                    if(action.action === 'create') {
                        await this
                            .handleCreateEntity(entity, trx)
                            .catch(trx.rollback);
                        break;
                    }

                    else if(action.action === 'update') {
                        await this
                            .handleUpdateEntity(entity, trx)
                            .catch(trx.rollback);
                        break;
                    }
                    else if(action.action === 'remove') {
                        await this
                            .handleRemoveEntity(entity, trx)
                            .catch(trx.rollback);
                        break;
                    }
                    resolve();
                }
            })
        })

    }

    async handleCreateEntity(entity, trx) {
        const beforeCreate = entity.beforeCreate;
        const afterCreate = entity.afterCreate;

        return new Promise(async (resolve, reject) => {
            const repository = serviceManager
                .get('repository.loader')
                .get(entity.tableName);

            let entityData = {};
            for(let [key] of entity.columns.keys()) {
                entityData[key] = entity.get(key)
            }

            for(let i = 0; i < beforeCreate.length; i ++) {
                await (beforeCreate[i])();
            }

            const createdEntity = await repository
                .create(entityData, trx, entity.primary)
                .catch(reject);

            for(let key of entity.columns.keys()) {
                if(typeof createdEntity[key] !== 'undefined')
                    entity.set(key, createdEntity[key])
            }

            for(let i = 0; i < afterCreate.length; i ++) {
                await (afterCreate[i])();
            }

            resolve(entity)
        });
    }

    async handleUpdateEntity(entity, trx) {
        const beforeUpdate = entity.beforeUpdate;
        const afterUpdate = entity.afterUpdate;

        return new Promise(async (resolve, reject) => {
            const repository = serviceManager
                .get('repository.loader')
                .get(entity.tableName);

            let entityData = {};
            for(let [key] of entity.columns.keys()) {
                entityData[key] = entity.get(key)
            }

            let criteria = {};
            criteria[entity.primary] = entity.get(entity.primary);

            for(let i = 0; i < beforeUpdate.length; i ++) {
                await (beforeUpdate[i])();
            }

            const updatedEntity = await repository.update(criteria, entityData, trx).catch(reject);

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
            const repository = serviceManager
                .get('repository.loader')
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