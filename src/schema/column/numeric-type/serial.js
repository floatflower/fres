const Column = require('../column');

class SerialColumn extends Column
{
    constructor(name) {
        super(name, 'character');
    }
}

module.exports = SerialColumn;