const Column = require('../column');

class BigIntegerColumn extends Column
{
    constructor(name) {
        super(name, 'bigint');
    }
}

module.exports = BigIntegerColumn;