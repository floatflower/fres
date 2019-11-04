const HTTPError = require('./http-error');

class ForbiddenError extends HTTPError
{
    constructor(code, detail = null) {
        super(403, code, detail);
    }
}

module.exports = ForbiddenError;