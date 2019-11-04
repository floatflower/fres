const Column = require('../column');

class DoublePrecisionColumn extends Column
{
    constructor(name) {
        super(name, 'double-precision');
    }
}

module.exports = DoublePrecisionColumn;