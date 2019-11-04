const Column = require('../column');

class UUIDColumn extends Column
{
    constructor(name) {
        super(name, 'uuid');
    }
}

module.exports = UUIDColumn;