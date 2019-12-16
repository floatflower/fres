const chai = require('chai');
const assert = chai.assert;

const ViewDataProvider = require('../../view-data-provider');
const ViewDataProviderLoader = require('../../view-data-provider-loader');

class FooProvider extends ViewDataProvider
{
    constructor() {
        super('foo');
    }

    async provide() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(['a', 'b'])
            }, 500)
        })
    }
}

class BarProvider extends ViewDataProvider
{
    constructor() {
        super('bar');
    }

    provide() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(3);
            }, 100)
        })
    }
}

describe('Test ViewDataProvider', () => {
   before(() => {
        ViewDataProviderLoader.set(FooProvider);
        ViewDataProviderLoader.set(BarProvider);
   });

    it('can get all view data from ViewDataProviderLoader', (done) => {
        ViewDataProviderLoader.getViewData()
            .then(viewData => {
                assert(viewData.foo[0] === 'a', '取得資料失敗');
                assert(viewData.foo[1] === 'b', '取得資料失敗');
                assert(viewData.bar === 3, '取得資料失敗');
                done();
            })
    });
});