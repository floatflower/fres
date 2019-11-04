const Column = require('../column');

class TextColumn extends Column
{
    constructor(name) {
        super(name, 'text');
    }
}

module.exports = TextColumn;