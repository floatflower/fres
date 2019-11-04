const HTTPError = require('./http-error');

class NotAcceptableError extends HTTPError
{
    constructor(code, detail = null) {
        super(406, code, detail);
    }
}

module.exports = NotAcceptableError;