const Column = require('../column');

class JsonColumn extends Column
{
    constructor(name) {
        super(name, 'json');
    }
}

module.exports = JsonColumn;