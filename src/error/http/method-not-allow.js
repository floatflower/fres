const HTTPError = require('./http-error');

class MethodNotAllowError extends HTTPError
{
    constructor(code, detail = null) {
        super(405, code, detail);
    }
}

module.exports = MethodNotAllowError;