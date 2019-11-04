const HTTPError = require('./http-error');

class NotFoundError extends HTTPError
{
    constructor(code, detail = null) {
        super(404, code, detail);
    }
}

module.exports = NotFoundError;