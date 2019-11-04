const Column = require('../column');

class JsonbColumn extends Column
{
    constructor(name) {
        super(name, 'jsonb');
    }
}

module.exports = JsonbColumn;