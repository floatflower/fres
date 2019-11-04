const Column = require('../column');

class BooleanColumn extends Column
{
    constructor(name) {
        super(name, 'boolean');
    }
}

module.exports = BooleanColumn;