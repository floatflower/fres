class ResponseRule {
    constructor(name)
    {
        this.name = name;
        this.fields = new Map();
    }

    register(fieldName, type = 'string', ignoreUndefined = false) {
        this.fields.set(fieldName, {
            type: type,
            ignoreUndefined: ignoreUndefined
        })
    }
}

module.exports = ResponseRule;