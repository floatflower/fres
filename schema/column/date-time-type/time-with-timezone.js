const Column = require('../column');

class TimeWithTimezoneColumn extends Column
{
    constructor(name) {
        super(name, 'time-with-timezone');
    }
}

module.exports = TimeWithTimezoneColumn;