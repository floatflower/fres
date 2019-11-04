const HTTPError = require('./http-error');

class GoneError extends HTTPError
{
    constructor(code, detail = null) {
        super(410, code, detail);
    }
}

module.exports = GoneError;