const moment = require('moment');

const RequestRule = require('../request-rule');
const dataHandler = require('../data-handler');
const requestRuleLoader = require('../request-rule-loader');

class RequestHandler {
    constructor() {

    }

    /**
     * @param rules
     * @param data
     */
    handle(rules, data) {
        let requestRules = rules;
        if(Array.isArray(data)) {
            let returnData = [];
            data.forEach(d => {
                let processedData = d;
                if(typeof rules === 'function') requestRules = rules(d);
                requestRules.forEach((ruleName) => {
                    let requestRule = requestRuleLoader.get(ruleName);
                    if(requestRule !== null) processedData = this.processData(requestRule, processedData);
                });
                returnData.push(processedData);
            });
            return returnData;
        } else {
            let processedData = data;
            if(typeof rules === 'function') requestRules = rules(data);
            requestRules.forEach((ruleName) => {
                let requestRule = requestRuleLoader.get(ruleName);
                if(requestRule !== null) processedData = this.processData(requestRule, processedData);
            });
            return processedData;
        }
    }

    processData(rule, data) {
        let returnData = {};
        rule.fields.forEach((field, name)=> {
            if(typeof data[name] === 'undefined') returnData[name] = field.defaultValue;
            else {
                let typeName = field.type;
                if(typeof field.type === 'function') {
                    typeName = field.type(data);
                }
                if (['integer', 'float', 'boolean', 'string', 'datetime'].includes(typeName)) {
                    switch(typeName) {
                        case 'integer':
                            returnData[name] = dataHandler.integer(data[name], field.defaultValue);
                            break;
                        case 'float':
                            returnData[name] = dataHandler.float(data[name], field.defaultValue);
                            break;
                        case 'boolean':
                            returnData[name] = dataHandler.boolean(data[name]);
                            break;
                        case 'datetime':
                            returnData[name] = moment(data[name]);
                            break;
                        default:
                            if(typeof data[name] === 'object') {
                                returnData[name] = JSON.stringify(data[name]);
                            } else {
                                returnData[name] = data[name]+"";
                            }
                            break;
                    }
                }
                else {
                    let subRule = requestRuleLoader.get(typeName);
                    if(subRule !== null) {
                        returnData[name] = this.processData(subRule, data[name])
                    }
                }
            }

        });
        return returnData;
    }
}

const singleton = new RequestHandler();

module.exports.RequestHandler = RequestHandler;
module.exports = singleton;