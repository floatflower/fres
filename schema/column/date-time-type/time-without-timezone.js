const Column = require('../column');

class TimeWithoutTimezoneColumn extends Column
{
    constructor(name) {
        super(name, 'time-without-timezone');
    }
}

module.exports = TimeWithoutTimezoneColumn;