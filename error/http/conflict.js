const HTTPError = require('./http-error');

class ConflictError extends HTTPError
{
    constructor(code, detail = null) {
        super(409, code, detail);
    }
}

module.exports = ConflictError;