const HTTPError = require('./http-error');

class PreconditionFailedError extends HTTPError
{
    constructor(code, detail = null) {
        super(412, code, detail);
    }
}

module.exports = PreconditionFailedError;