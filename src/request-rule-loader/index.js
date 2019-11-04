const validation = require('../validation');
const RequestRule = require('../request-rule');

class RequestRuleLoader
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
            if(root instanceof RequestRule) this.rules.set(root.name, rule);
        }

    }
}

const singleton = new RequestRuleLoader();

module.exports.RequestRuleLoader = RequestRuleLoader;
module.exports = singleton;