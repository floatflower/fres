const HTTPError = require('./http-error');

class RequestHeaderFieldsTooLargeError extends HTTPError
{
    constructor(code, detail = null) {
        super(431, code, detail);
    }
}

module.exports = RequestHeaderFieldsTooLargeError;