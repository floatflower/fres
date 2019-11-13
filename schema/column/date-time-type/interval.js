const Column = require('../column');

class IntervalColumn extends Column
{
    constructor(name) {
        super(name, 'interval');
    }
}

module.exports = IntervalColumn;