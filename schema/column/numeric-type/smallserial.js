const Column = require('../column');

class SmallSerialColumn extends Column
{
    constructor(name) {
        super(name, 'small-serial');
    }
}

module.exports = SmallSerialColumn;