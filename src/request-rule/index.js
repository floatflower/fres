class RequestRule {

    constructor(name) {
        this.name = name;
        this.fields = new Map();
    }

    /**
     * @param fieldName
     * @param type
     * @param required
     * @param defaultValue
     */
    register(fieldName, type = 'string', required = true, defaultValue = null) {
        this.fields.set(fieldName, {
            type: type,
            required: required,
            defaultValue: defaultValue
        })
    }


}

module.exports = RequestRule;