const dataHandler = require('../data-handler');
const ResponseRuleLoader = require('../response-rule-loader');

class ResponseHandler {
    constructor(name) {
        this.name = name;
    }

    handle(rules, data) {
        let _rules = [];
        if(typeof rules === 'string') _rules.push(rules);
        else _rules = rules;

        if(!Array.isArray(data)) {
            if(typeof rules === 'function') _rules = rules(data);
            let _data = Object.assign({}, data);
            _rules.forEach(rule => {
                _data = this.processData(rule, data);
            });
            return _data;
        } else {
            let responseData = [];

            data.forEach(d => {
                if(typeof rules === 'function') _rules = rules(d);
                let _data = Object.assign({}, d);
                _rules.forEach(rule => {
                    _data = this.processData(rule, _data);
                });
                responseData.push(_data);
            });
            return responseData;
        }

    }

    processData(ruleName, data) {
        let _data = {};
        let rule = ResponseRuleLoader.get(ruleName);
        rule.fields.forEach((value, index) => {
            if(typeof data[index] !== 'undefined') {
                switch (value.type) {
                    case 'integer':
                        _data[index] = dataHandler.integer(data[index], null);
                        break;
                    case 'float':
                        _data[index] = dataHandler.float(data[index], null);
                        break;
                    case 'boolean':
                        _data[index] = dataHandler.boolean(data[index]);
                        break;
                    case 'string':
                        _data[index] = typeof data[index] === 'object' ?
                            data[index].toString() : data[index] + "";
                        break;
                    default:
                        let _types = null;
                        if(typeof value.type === 'function') _types = value.type(data);
                        else _types = value.type;
                        _data[index] = this.handle(_types, data[index]);
                        break;
                }
            } else if (!value.ignoreUndefined){
                _data[index] = null;
            }
        });
        return _data;
    }
}

const singleton = new ResponseHandler();

module.exports.ResponseHandler = ResponseHandler;
module.exports = singleton;