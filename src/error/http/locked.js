const HTTPError = require('./http-error');

class LockedError extends HTTPError
{
    constructor(code, detail = null) {
        super(423, code, detail);
    }
}

module.exports = LockedError;