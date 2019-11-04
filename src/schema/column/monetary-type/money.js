const Column = require('../column');

class MoneyColumn extends Column
{
    constructor(name) {
        super(name, 'money');
    }
}

module.exports = MoneyColumn;