const Column = require('../column');

class ByteaColumn extends Column
{
    constructor(name) {
        super(name, 'bytea');
    }
}

module.exports = ByteaColumn;