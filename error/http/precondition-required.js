const HTTPError = require('./http-error');

class PreconditionRequired extends HTTPError
{
    constructor(code, detail = null) {
        super(428, code, detail);
    }
}

module.exports = PreconditionRequired;