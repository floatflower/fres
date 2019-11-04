const Column = require('../column');

class NumericColumn extends Column
{
    constructor(name) {
        super(name, 'numeric');
    }
}

module.exports = NumericColumn;