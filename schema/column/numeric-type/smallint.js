const Column = require('../column');

class SmallIntColumn extends Column
{
    constructor(name) {
        super(name, 'smallint');
    }
}

module.exports = SmallIntColumn;