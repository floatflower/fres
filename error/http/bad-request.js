const HTTPError = require('./http-error');

class BadRequestError extends HTTPError
{
    constructor(code, detail = null) {
        super(400, code, detail);
    }
}

module.exports = BadRequestError;