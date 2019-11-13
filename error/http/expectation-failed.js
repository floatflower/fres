const HTTPError = require('./http-error');

class ExpectationFailedError extends HTTPError
{
    constructor(code, detail = null) {
        super(417, code, detail);
    }
}

module.exports = ExpectationFailedError;