const Column = require('../column');

class DatetimeWithTimezoneColumn extends Column
{
    constructor(name) {
        super(name, 'datetime-with-timezone');
    }
}

module.exports = DatetimeWithTimezoneColumn;