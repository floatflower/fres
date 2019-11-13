const Column = require('../column');

class RealColumn extends Column
{
    constructor(name) {
        super(name, 'real');
    }
}

module.exports = RealColumn;