const Column = require('../column');

class DatetimeWithoutTimezoneColumn extends Column
{
    constructor(name) {
        super(name, 'datetime-without-timezone');
    }
}

module.exports = DatetimeWithoutTimezoneColumn;