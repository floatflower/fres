const Column = require('../column');

class BigSerialColumn extends Column
{
    constructor(name) {
        super(name, 'bigserial');
    }
}

module.exports = BigSerialColumn;