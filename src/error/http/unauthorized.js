const HTTPError = require('./http-error');

class UnauthorizedError extends HTTPError
{
    constructor(code, detail = null) {
        super(401, code, detail);
    }
}

module.exports = UnauthorizedError;