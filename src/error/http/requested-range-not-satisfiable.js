const HTTPError = require('./http-error');

class RequestedRangeNotSatisfiable extends HTTPError
{
    constructor(code, detail = null) {
        super(416, code, detail);
    }
}

module.exports = RequestedRangeNotSatisfiable;