const fs = require('fs');
const validation = require('../validation');
const ResponseRule = require('../response-rule');

class ResponseRuleLoader
{
    constructor() {
        this.rules = new Map();
    }

    init() {
        let responseRuleDirectory = `${process.cwd()}/src/response-rule`;
        if(fs.existsSync(responseRuleDirectory)) {
            let filesList = fs.readdirSync(responseRuleDirectory);
            filesList.forEach(file => {
                if (fs.statSync(`${responseRuleDirectory}/${file}`).isFile()) {
                    let responseRuleConstructor = require(`${responseRuleDirectory}/${file}`);
                    if (validation.isConstructor(responseRuleConstructor)) {
                        let rootInstance = new responseRuleConstructor();
                        if (rootInstance instanceof ResponseRule) {
                            this.set(responseRuleConstructor);
                        }
                    }
                }
            });
        }
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
singleton.init();
module.exports = singleton;