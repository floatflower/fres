const HTTPError = require('./http-error');

class UnprocessableEntityError extends HTTPError
{
    constructor(code, detail = null) {
        super(422, code, detail);
    }
}

module.exports = UnprocessableEntityError;