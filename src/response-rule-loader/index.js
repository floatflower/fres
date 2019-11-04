const validation = require('../validation');
const ResponseRule = require('../response-rule');

class ResponseRuleLoader
{
    constructor() {
        this.rules = new Map();
    }

    get(rule) {
        if(this.rules.has(rule)) {
            return new (this.rules.get(rule));
        } else return null;
    }

    set(rule) {
        if(validation.isConstructor(rule)) {
            let root = new rule();
            if(root instanceof ResponseRule) this.rules.set(root.name, rule);
        }

    }
}

const singleton = new ResponseRuleLoader();

module.exports.ResponseRuleLoader = ResponseRuleLoader;
module.exports = singleton;