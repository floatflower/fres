const HTTPError = require('./http-error');

class IAmATeapotError extends HTTPError
{
    constructor(code, detail = null) {
        super(418, code, detail);
    }
}

module.exports = IAmATeapotError;