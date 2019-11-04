const Column = require('../column');

class IntegerColumn extends Column
{
    constructor(name) {
        super(name, 'integer');
    }
}

module.exports = IntegerColumn;