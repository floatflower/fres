const validation = require('../validation');
const dataHandler = require('../data-handler');
const entityLoader = require('../entity-loader');

// TODO: rollback when exception occur.
class Repository
{
    constructor(tableName, knex = null) {
        this.knex = require('../knex');
        this.table = tableName;
    }

    /**
     * 用於搜索唯一資訊函數，
     * 雖然以邏輯上這個函數仍可以搜索到多筆目標資料，
     * 但他僅會返回搜尋結果中的第一比資料，
     * 因此若用於搜尋非唯一資訊，可能導致搜尋結果不穩定，
     * 若沒有找到任何一筆符合 criteria 的資料，
     * 將會直接回傳 null。
     * fineOneBy 也提供了另一個功能適用於鎖住所有符合 criteria 的資料行，
     * 與 findBy 的鎖功能概念上相同，僅在鎖定後的回傳值有所的不同。
     * @param criteria
     * @param trx
     * @param lockMode
     * @return Object|null
     */
    findOneBy(criteria, trx = null, lockMode = 'share') {
        return new Promise((resolve, reject) => {

            let _criteria = {};
            const rootEntity = entityLoader.get(this.table);

            if(rootEntity.isBasicEntity) _criteria = criteria;
            else {
                Object.keys(criteria).forEach(key => {
                    if(rootEntity.columns.has(key)) _criteria[key] = criteria[key];
                })
            }

            if(validation.isEmptyObject(_criteria)) {
                process.nextTick(() => {resolve(null)});
            }
            else {
                let q = this.knex(this.table)
                    .select();

                if(trx !== null) {
                    q.transacting(trx);
                    if(lockMode === 'update') q.forUpdate();
                    else q.forShare();
                }

                Object.keys(_criteria).forEach((key) => {
                    q.andWhere(key, _criteria[key]);
                });

                q.then((results) => {
                    if(results.length === 0) {
                        resolve(null);
                        return false;
                    }
                    let result = results[0];
                    const entity = entityLoader.get(this.table);
                    entity.handleRowData(result);
                    resolve(entity);
                }, reject);
            }
        })
    }

    // Function Alias
    find(id, trx = null, lockMode = 'share') {
        const entity = entityLoader.get(this.table);
        if(entity.primary === null) return null;

        let criteria = {};
        criteria[entity.primary] = id;
        return this.findOneBy(criteria, trx, lockMode);
    }

    /**c
     * 用於搜索符合條件的資料集合，
     * 利用 orderBy 來控制資料的排序，
     * 透過 limit 及 offset 可以控制回來的資料筆數以及第一筆開始的資料號，
     * fineBy 也提供了另一個功能適用於鎖住所有符合 criteria 的資料行，
     * 與 findOneBy 的鎖功能概念上相同，僅在鎖定後的回傳值有所的不同。
     * @param criteria
     * @param orderBy
     * @param limit
     * @param offset
     * @param trx
     * @param lockMode
     */
    findBy(criteria = {}, orderBy = {}, limit = null, offset = null, trx = null, lockMode = 'share') {
        return new Promise((resolve, reject) => {

            let _criteria = {};
            const rootEntity = entityLoader.get(this.table);

            if(rootEntity.isBasicEntity) _criteria = criteria;
            else {
                Object.keys(criteria).forEach(key => {
                    if(rootEntity.columns.has(key)) _criteria[key] = criteria[key];
                })
            }

            let q = this.knex(this.table)
                .select();

            if(trx !== null) {
                q.transacting(trx);
                if(lockMode === 'update') q.forUpdate();
                else q.forShare();
            }

            Object.keys(_criteria).forEach(key => q.andWhere(key, _criteria[key]));

            if(!validation.isEmptyObject(orderBy)) {
                Object.keys(orderBy).forEach(key => q.orderBy(key, orderBy[key]));
            }

            if(typeof limit !== 'undefined' && limit !== null) q.limit(dataHandler.integer(limit));
            if(typeof offset !== 'undefined' && offset !== null) q.offset(dataHandler.integer(offset));

            let returnData = [];
            q.then((results) => {
                if(results.length === 0) resolve([]);
                for(let i = 0; i < results.length; i++) {
                    const entity = entityLoader.get(this.table);
                    entity.handleRowData(results[i]);
                    returnData.push(entity);
                }
                resolve(returnData);
            }, reject)
        })
    }

    /**
     * 直接將 data 插入資料庫中，
     * 在呼叫這個函數前務必先檢查資料是否正確，如：是否有唯一鍵的衝突、必要欄位送null等。
     * 這個函數的回傳值是將插入的資料加上這個資料寫入資料庫後的 Primary ID 後回傳，
     * 這個 Primary ID 的 column name 是可以設定的，預設為 id，若今天插入後的資料假設為 transaction_id 的話
     * 透過呼叫 create({}, 'transaction_id') 即可取得由資料庫產生的這個值
     * 這個函數的第二個參數可以送入 trx，若 trx 來自他的調用者，
     * 則會直接引用這筆交易，完成之後會返回給調用者繼續他的交易，
     * 若沒有給定 trx 這個函數將為自動產生一個自主的 trx 並在函數結束前 commit 該 trx。
     * @param data
     * @param trx
     * @param returning
     */
    create(data, trx = null, returning = 'id') {
        return new Promise((resolve, reject) => {

            let _data = {};
            const rootEntity = entityLoader.get(this.table);
            if(rootEntity.isBasicEntity) _data = data;
            else {
                Object.keys(data).forEach(key => {
                    if (rootEntity.columns.has(key)) _data[key] = data[key];
                })
            }

            let selfTransaction = (trx === null);
            let _trx = null;
            let transaction = new Promise((resolve) => {
                if(trx) resolve(trx);
                else return this.knex.transaction(resolve, reject);
            });

            transaction
                .then((generatedTrx) => {
                    _trx = generatedTrx;
                })
                .then(() => {
                    return typeof returning === 'string' ?
                        this.knex(this.table).insert(_data).transacting(_trx).returning(returning)
                        : this.knex(this.table).insert(_data).transacting(_trx);
                })
                .then((results) => {
                    // 將 returning 取得的值，放入到 data 中。
                    if(typeof returning === 'string') _data[returning] = results[0];
                    const entity = entityLoader.get(this.table);
                    // 如果這筆寫入的事務是屬於 self transaction 的型態，在插入動作結束後，就將該事務 commit。
                    if(selfTransaction) return _trx.commit().then(() => {
                        entity.handleRowData(_data);
                        resolve(entity)
                    }, reject);
                    else {
                        entity.handleRowData(_data);
                        resolve(entity);
                    }
                })
        });
    }

    /**
     * 直接將 data 更新到符合 criteria 的 row 中，
     * 在這之前會透過 SELECT * FROM criteria FOR UPDATE 來阻塞所有衝突的更新，
     * 這個函數的第二個參數可以送入 trx，若 trx 來自他的調用者，
     * 則會直接引用這筆交易，完成之後會返回給調用者繼續他的交易，
     * 若沒有給定 trx 這個函數將為自動產生一個自主的 trx 並在函數結束前 commit 該 trx。
     * @param criteria
     * @param data
     * @param trx
     */
    update(criteria, data, trx = null) {
        return new Promise((resolve, reject) => {
            const rootEntity = entityLoader.get(this.table);
            let _criteria = {};
            if(rootEntity.isBasicEntity) _criteria = criteria;
            else {
                Object.keys(criteria).forEach(key => {
                    if(rootEntity.columns.has(key)) _criteria[key] = criteria[key];
                })
            }

            let _data = {};
            if(rootEntity.isBasicEntity) _data = data;
            else {
                Object.keys(data).forEach(key => {
                    _data[key] = data[key];
                });
            }

            if(validation.isEmptyObject(_data)) {
                process.nextTick(() => {
                    resolve();
                });
            } else {
                let selfTransaction = (trx === null);
                let _trx = null;
                let transaction = new Promise((resolve) => {
                    if(trx) resolve(trx);
                    else return this.knex.transaction(resolve, reject);
                });
                transaction
                    .then(generatedTrx => { _trx = generatedTrx })
                    .then(() => this.findBy(_criteria, {}, _trx, 'update'))
                    .then(() => {
                        let q = this.knex(this.table).update(_data).transacting((_trx));
                        Object.keys(_criteria).forEach(key => q.andWhere(key, _criteria[key]));
                        return q;
                    })
                    .then(() => {
                        // 如果這筆寫入的事務是屬於 self transaction 的型態，在更新動作結束後，就將該事務 commit。
                        if(selfTransaction) return _trx.commit().then(resolve, reject);
                        else resolve();
                    })
            }
        });
    }

    // Function Alias
    updateWithId(id, data, trx = null) {
        const entity = entityLoader.get(this.table);
        if(entity.primary === null) return null;
        else {
            let criteria = {};
            criteria[entity.primary] = id;
            return this.update(criteria, data, trx);
        }
    }

    /**
     * 刪除符合 criteria 的 row 中，
     * 在這之前會透過 SELECT * FROM criteria FOR UPDATE 來阻塞所有衝突的更新，
     * 這個函數的第二個參數可以送入 trx，若 trx 來自他的調用者，
     * 則會直接引用這筆交易，完成之後會返回給調用者繼續他的交易，
     * 若沒有給定 trx 這個函數將為自動產生一個自主的 trx 並在函數結束前 commit 該 trx。
     * @param criteria
     * @param trx
     */
    remove(criteria, trx = null) {
        return new Promise((resolve, reject) => {

            const rootEntity = entityLoader.get(this.table);
            let _criteria = {};
            if(rootEntity.isBasicEntity) _criteria = criteria;
            else {
                Object.keys(criteria).forEach(key => {
                    if(rootEntity.columns.has(key)) _criteria[key] = criteria[key];
                })
            }

            let selfTransaction = (trx === null);
            let _trx = null;
            let transaction = new Promise((resolve) => {
                if(trx !== null) resolve(trx);
                else return this.knex.transaction(resolve, reject);
            });

            transaction
                .then((generatedTrx) => { _trx = generatedTrx; })
                .then(() => {
                    let q = this.knex(this.table);
                    Object.keys(_criteria).forEach(key => q.andWhere(key, _criteria[key]));
                    return q.del().transacting(_trx);
                })
                .then(() => {
                    // 如果這筆寫入的事務是屬於 self transaction 的型態，在刪除動作結束後，就將該事務 commit。
                    if(selfTransaction) return _trx.commit().then(resolve, reject);
                    else resolve();
                })
        })
    }

    // Function Alias
    removeWithID(id, trx = null) {
        const entity = entityLoader.get(this.table);
        if(entity.primary === null) return null;
        let criteria = {};
        criteria[entity.primary] = id;
        return this.remove(criteria, trx);
    }

    /**
     * 計算符合 criteria 資料的筆數，
     * 並通過 countKey 來作為計算的依據。
     * @param criteria
     * @param countKey
     * @param trx
     */
    count(criteria, trx = null, countKey = 'id') {
        return new Promise((resolve, reject) => {

            const rootEntity = entityLoader.get(this.table);
            let _criteria = {};
            if(rootEntity.isBasicEntity) _criteria = criteria;
            else {
                Object.keys(criteria).forEach(key => {
                    if(rootEntity.columns.has(key)) _criteria[key] = criteria[key];
                })
            }

            let q = this.knex(this.table)
                .count(`${countKey} as c`);

            if(trx !== null) {
                q.transacting(trx);
            }

            Object.keys(_criteria).forEach(key => q.andWhere(key, _criteria[key]));

            q.then(result => {
                resolve(dataHandler.integer(result[0].c));
            }, reject)
        })
    }
}

module.exports = Repository;