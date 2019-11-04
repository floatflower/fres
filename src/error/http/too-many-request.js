const HTTPError = require('./http-error');

class TooManyRequestError extends HTTPError
{
    constructor(code, detail = null) {
        super(429, code, detail);
    }
}

module.exports = TooManyRequestError;