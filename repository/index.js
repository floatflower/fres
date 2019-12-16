const validation = require('../validation');
const dataHandler = require('../data-handler');
const tableLoader = require('../table-loader');

// TODO: rollback when exception occur.
class Repository
{
    constructor(tableName) {
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

            let _criteria = criteria;

            if(validation.isEmptyObject(_criteria)) {
                resolve(null);
                return false;
            }

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
                resolve(result);
            }, reject);
        })
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

            let _criteria = criteria;

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

            return q.then(resolve, reject)
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
     */
    create(data, trx = null) {
        return new Promise((resolve, reject) => {
            let returning = [];

            const tableDefinition = tableLoader.get(this.table);
            for(let key of tableDefinition.columns.keys()) {
                returning.push(key);
            }

            let q = this.knex(this.table).insert(data).returning(returning);
            if(trx) q.transacting(trx);

            q.then((results) => {
                // 將 returning 取得的值，放入到 data 中。
                resolve(results[0]);
            }, reject)

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

            let returning = [];

            const tableDefinition = tableLoader.get(this.table);
            for(let key of tableDefinition.columns.keys()) {
                returning.push(key);
            }

            if(validation.isEmptyObject(data)) {
                return this.findBy(criteria).then(resolve, reject);
            } else {
                let q = this.knex(this.table).update(data).returning(returning);
                Object.keys(criteria).forEach(key => q.andWhere(key, criteria[key]));
                if(trx) q.transacting(trx);
                q.then(resolve, reject);
            }
        });
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
            let q = this.knex(this.table);
            Object.keys(criteria).forEach(key => q.andWhere(key, criteria[key]));
            if(trx) q.transacting(trx);

            return q.del().then(resolve, reject);
        })
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


            let q = this.knex(this.table)
                .count(`${countKey} as c`);

            if(trx) q.transacting(trx);

            Object.keys(criteria).forEach(key => q.andWhere(key, criteria[key]));

            q.then(result => {
                resolve(dataHandler.integer(result[0].c));
            }, reject)
        })
    }
}

module.exports = Repository;