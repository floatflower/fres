const Column = require('../column');

class DecimalColumn extends Column
{
    constructor(name) {
        super(name, 'decimal');
    }
}

module.exports = DecimalColumn;