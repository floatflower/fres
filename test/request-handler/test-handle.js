const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const requestRuleLoader = require('../../request-rule-loader');
const requestHandler = require('../../request-handler');
const RequestRule = require('../../request-rule');

class TestRequestRule extends RequestRule
{
    constructor()
    {
        super('test');

        this.register('a', 'integer', true, 2);
        this.register('b', 'float', true, 1.2);
        this.register('c', 'boolean', true, false);
        this.register('d', 'string', false, 'defaultValue');
    }
}

class Test2RequestRule extends RequestRule
{
    constructor() {
        super('test2');

        this.register('sub', 'test', true, {
            a: 1,
            b: 1.2,
            c: false,
            d: 'defaultValue'
        });
        this.register('e', 'integer', false, 1.2);
    }
}

class Selectable1RequestRule extends RequestRule
{
    constructor()
    {
        super('select1');

        this.register('a', 'integer', true, 2);
        this.register('b', 'integer', false, 10);
    }
}

class Selectable2RequestRule extends RequestRule
{
    constructor()
    {
        super('select2');

        this.register('a', 'integer', true, 1);
        this.register('b', 'integer', false, 20);
    }
}

class SelectorRequestRule extends RequestRule
{
    constructor()
    {
        super('selector');

        this.register('sub', (data) => {
            return data.sub.a === 2 ? 'select1' : 'select2';
        }, true, 2);
        this.register('c', 'integer', false, 20);
    }
}

describe('Test ResponseHandler handle()', () => {

    beforeEach(() => {
        requestRuleLoader.set(TestRequestRule);
        requestRuleLoader.set(Test2RequestRule);
        requestRuleLoader.set(Selectable1RequestRule);
        requestRuleLoader.set(Selectable2RequestRule);
        requestRuleLoader.set(SelectorRequestRule);
    });

    it('測試所有格式皆正確', (done) => {
        let result
            = requestHandler.handle(['test'], {
                a: 1,
                b: 1.3,
                c: false,
                d: 'test'
            });
        assert(result.a === 1, '處理失敗');
        assert(result.b === 1.3, '處理失敗');
        assert(result.c === false, '處理失敗');
        assert(result.d === 'test', '處理失敗');
        done();
    });

    it('測試在 required = false 時會自動填上預設值。', (done) => {
        let result
            = requestHandler.handle(['test'], {
                a: 1,
                b: 1.3,
                c: false});

        assert(result.a === 1, '處理失敗');
        assert(result.b === 1.3, '處理失敗');
        assert(result.c === false, '處理失敗');
        assert(result.d === 'defaultValue', '處理失敗');
        done();
    });

    it('測試在 integer 為 unparsable 時，會自動填上預設值。', (done) => {
        let result
            = requestHandler.handle(['test'], {
            a: "alsdjlakjsd",
            b: 1.3,
            c: false,
            d: 'test'
        });
        assert(result.a === 2, '處理失敗');
        assert(result.b === 1.3, '處理失敗');
        assert(result.c === false, '處理失敗');
        assert(result.d === 'test', '處理失敗');
        done();
    });

    it('測試 integer 在 parsable 的字串到來時會自動解析。', (done) => {
        let result
            = requestHandler.handle(['test'], {
            a: "1000",
            b: 1.3,
            c: false,
            d: 'test'
        });
        assert(result.a === 1000, '處理失敗');
        assert(result.b === 1.3, '處理失敗');
        assert(result.c === false, '處理失敗');
        assert(result.d === 'test', '處理失敗');
        done();
    });

    it('測試在 float 為 unparsable 時，會自動填上預設值。', (done) => {
        let result
            = requestHandler.handle(['test'], {
            a: 1,
            b: "asdalsjak",
            c: false,
            d: 'test'
        });
        assert(result.a === 1, '處理失敗');
        assert(result.b === 1.2, '處理失敗');
        assert(result.c === false, '處理失敗');
        assert(result.d === 'test', '處理失敗');
        done();
    });

    it('測試 float 在 parsable 的字串到來時會自動解析。', (done) => {
        let result
            = requestHandler.handle(['test'], {
            a: 1,
            b: "9.1",
            c: false,
            d: 'test'
        });
        assert(result.a === 1, '處理失敗');
        assert(result.b === 9.1, '處理失敗');
        assert(result.c === false, '處理失敗');
        assert(result.d === 'test', '處理失敗');
        done();
    });

    it('測試在 boolean 為 unparsable 時，會解析為 false。', (done) => {
        let result
            = requestHandler.handle(['test'], {
            a: 1,
            b: 1.3,
            c: "aslalkdjasl",
            d: 'test'
        });
        assert(result.a === 1, '處理失敗');
        assert(result.b === 1.3, '處理失敗');
        assert(result.c === false, '處理失敗');
        assert(result.d === 'test', '處理失敗');
        done();
    });

    it('測試在 boolean 為 字串 "true" 時，會自動解析為 true。', (done) => {
        let result
            = requestHandler.handle(['test'], {
            a: 1,
            b: 1.3,
            c: "true",
            d: 'test'
        });
        assert(result.a === 1, '處理失敗');
        assert(result.b === 1.3, '處理失敗');
        assert(result.c === true, '處理失敗');
        assert(result.d === 'test', '處理失敗');
        done();
    });

    it('測試在 boolean 為字串 "false" 時，會自動解析為 false。', (done) => {
        let result
            = requestHandler.handle(['test'], {
            a: 1,
            b: 1.3,
            c: "false",
            d: 'test'
        });
        assert(result.a === 1, '處理失敗');
        assert(result.b === 1.3, '處理失敗');
        assert(result.c === false, '處理失敗');
        assert(result.d === 'test', '處理失敗');
        done();
    });

    it('測試 Sub Rule 會正確引出並巢狀處理。', (done) => {
        let result
            = requestHandler.handle(['test2'], {
                sub: {
                    a: 1,
                    b: 3,
                    c: false,
                    d: 'good'
                }
            });

        assert(result.sub.a === 1, '處理失敗');
        assert(result.sub.b === 3, '處理失敗');
        assert(result.sub.c === false, '處理失敗');
        assert(result.sub.d === 'good', '處理失敗');
        assert(result.e === 1.2, '處理失敗');
        done();
    });

    it('陣列的請求也可以正確的處理每一個陣列元素', (done) => {
        let result
            = requestHandler.handle(['test'], [
                {
                    a: 1,
                    b: 1.3,
                    c: false,
                    d: 'test'
                },
                {
                    a: 2,
                    b: 2.3,
                    c: "true",
                    d: "test2"
                }
            ]);
        assert(result[0].a === 1, '處理失敗');
        assert(result[0].b === 1.3, '處理失敗');
        assert(result[0].c === false, '處理失敗');
        assert(result[0].d === 'test', '處理失敗');
        assert(result[1].a === 2, '處理失敗');
        assert(result[1].b === 2.3, '處理失敗');
        assert(result[1].c === true, '處理失敗');
        assert(result[1].d === 'test2', '處理失敗');
        done();
    });

    it('能夠透過動態 type 決定 RequestRule。', (done) => {
        let result
            = requestHandler.handle(['selector'], [
            {
                sub: {
                    a: 2
                }
            },
            {
                sub: {
                    a: 1
                }
            }
        ]);
        assert(result[0].sub.b === 10, '處理失敗');
        assert(result[1].sub.b === 20, '處理失敗');
        done();
    });

    it('能夠對整體做請求做分支處理。', (done) => {
        let selector = function(data) {
            return data.a === 2 ? ['select1'] : ['select2'];
        };
        let result
            = requestHandler.handle(selector, [
            {
                a: 2
            },
            {
                a: 1
            }
        ]);
        assert(result[0].b === 10, '處理失敗');
        assert(result[1].b === 20, '處理失敗');
        done();
    });
});