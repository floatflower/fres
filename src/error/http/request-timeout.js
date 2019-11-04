const HTTPError = require('./http-error');

class RequestTimeoutError extends HTTPError
{
    constructor(code, detail = null) {
        super(408, code, detail);
    }
}

module.exports = RequestTimeoutError;