const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const ResponseHandler = require('../../src/response-handler');
const ResponseRule = require('../../src/response-rule');
const ResponseRuleLoader = require('../../src/response-rule-loader');

class TestResponseRule extends ResponseRule
{
    constructor() {
        super('test');

        this.register('test1', 'integer');
        this.register('test2', 'float');
        this.register('test3', 'boolean');
        this.register('test4', 'string');
    }
}

class Test2ResponseRule extends ResponseRule
{
    constructor() {
        super('test2');

        this.register('test1', 'integer');
        this.register('test2', 'float');
        this.register('test3', 'boolean');
        this.register('test4', 'string', true);
    }
}

class Test3ResponseRule extends ResponseRule
{
    constructor() {
        super('test3');

        this.register('test1', 'integer');
        this.register('test2', 'test');
    }
}

describe('Test ResponseHandler handle()', () => {

    beforeEach(() => {
        ResponseRuleLoader.set(TestResponseRule);
        ResponseRuleLoader.set(Test2ResponseRule);
        ResponseRuleLoader.set(Test3ResponseRule);
    });

    it('正常處理資料', (done) => {
        let handledData = ResponseHandler.handle(['test'], {
            test1: "1",
            test2: "1.2",
            test3: "true",
            test4: 1.2
        });
        assert(handledData.test1 === 1, 'integer 處理失敗。');
        assert(handledData.test2 === 1.2, 'float 處理失敗。');
        assert(handledData.test3 === true, 'boolean 處理失敗。');
        assert(handledData.test4 === "1.2", "string 處理失敗。");
        done();
    });

    it('若 ResponseRule 有定義但送入的值為 Undefined 時且 ignoreUndefined === false，會處理為 null。', (done) => {
        let handledData = ResponseHandler.handle(['test'], {
            test1: "1",
            test2: "1.2",
            test3: "true"
        });
        assert(handledData.test1 === 1, 'integer 處理失敗。');
        assert(handledData.test2 === 1.2, 'float 處理失敗。');
        assert(handledData.test3 === true, 'boolean 處理失敗。');
        assert(handledData.test4 === null, "string 處理失敗。");
        done();
    });

    it('若 ResponseRule 有定義但送入的值為 Undefined 時且 ignoreUndefined === true，會直接被忽略。', (done) => {
        let handledData = ResponseHandler.handle(['test2'], {
            test1: "1",
            test2: "1.2",
            test3: "true"
        });
        assert(handledData.test1 === 1, 'integer 處理失敗。');
        assert(handledData.test2 === 1.2, 'float 處理失敗。');
        assert(handledData.test3 === true, 'boolean 處理失敗。');
        assert(typeof handledData.test4 === 'undefined', "ignoreUndefined 處理失敗。");
        done();
    });

    it('可以透過函數來決定 ResponseRule', (done) => {
        let selector = function(data) {
            if(data.test1 === "1") return ['test'];
            else return ['test2'];
        };
        let handledData = ResponseHandler.handle(selector, {
            test1: "1",
            test2: "1.2",
            test3: "true"
        });
        assert(handledData.test1 === 1, 'integer 處理失敗。');
        assert(handledData.test2 === 1.2, 'float 處理失敗。');
        assert(handledData.test3 === true, 'boolean 處理失敗。');
        assert(handledData.test4 === null, "string 處理失敗。");

        let handledData2 = ResponseHandler.handle(selector, {
            test1: "2",
            test2: "1.2",
            test3: "true"
        });

        assert(handledData2.test1 === 2, 'integer 處理失敗。');
        assert(handledData2.test2 === 1.2, 'float 處理失敗。');
        assert(handledData2.test3 === true, 'boolean 處理失敗。');
        assert(typeof handledData2.test4 === 'undefined', "ignoreUndefined 處理失敗。");
        done();
    });

    it('能夠正常處理陣列', (done) => {
        let handledData = ResponseHandler.handle(['test'], [
            {
                test1: "1",
                test2: "1.2",
                test3: "true",
                test4: 1.2
            },
            {
                test1: "2",
                test2: "2.4",
                test3: "false",
                test4: 1.8
            }
        ]);
        assert(handledData[0].test1 === 1, 'integer 處理失敗。');
        assert(handledData[0].test2 === 1.2, 'float 處理失敗。');
        assert(handledData[0].test3 === true, 'boolean 處理失敗。');
        assert(handledData[0].test4 === "1.2", "string 處理失敗。");
        assert(handledData[1].test1 === 2, 'integer 處理失敗。');
        assert(handledData[1].test2 === 2.4, 'float 處理失敗。');
        assert(handledData[1].test3 === false, 'boolean 處理失敗。');
        assert(handledData[1].test4 === "1.8", "string 處理失敗。");
        done();
    });

    it('能夠處理巢狀的處理器', (done) => {
        let handledData = ResponseHandler.handle(['test3'], {
            test1: "1",
            test2: {
                test1: "1",
                test2: "1.2",
                test3: "true",
                test4: 1.2
            }
        });
        assert(handledData.test1 === 1, 'integer處理失敗。');
        assert(handledData.test2.test1 === 1, 'sub integer 處理失敗。');
        assert(handledData.test2.test2 === 1.2, 'sub float 處理失敗。');
        assert(handledData.test2.test3 === true, 'sub boolean 處理失敗。');
        assert(handledData.test2.test4 === "1.2", 'sub string 處理失敗。');
        done();
    });

    it('能夠處理巢狀的陣列處理器', (done) => {
        let handledData = ResponseHandler.handle(['test3'], {
            test1: "1",
            test2: [
                {
                    test1: "1",
                    test2: "1.2",
                    test3: "true",
                    test4: 1.2
                },
                {
                    test1: "2",
                    test2: "2.3",
                    test3: "false",
                    test4: 2.3
                }
            ]
        });
        assert(handledData.test1 === 1, 'integer處理失敗。');
        assert(handledData.test2[0].test1 === 1, 'sub integer 處理失敗。');
        assert(handledData.test2[0].test2 === 1.2, 'sub float 處理失敗。');
        assert(handledData.test2[0].test3 === true, 'sub boolean 處理失敗。');
        assert(handledData.test2[0].test4 === "1.2", 'sub string 處理失敗。');
        assert(handledData.test2[1].test1 === 2, 'sub integer 處理失敗。');
        assert(handledData.test2[1].test2 === 2.3, 'sub float 處理失敗。');
        assert(handledData.test2[1].test3 === false, 'sub boolean 處理失敗。');
        assert(handledData.test2[1].test4 === "2.3", 'sub string 處理失敗。');
        done();
    });
});