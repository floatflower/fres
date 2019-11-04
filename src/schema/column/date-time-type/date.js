const Column = require('../column');

class DateColumn extends Column
{
    constructor(name) {
        super(name, 'date');
    }
}

module.exports = DateColumn;