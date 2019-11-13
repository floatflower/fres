const HTTPError = require('./http-error');

class LengthRequiredError extends HTTPError
{
    constructor(code, detail = null) {
        super(411, code, detail);
    }
}

module.exports = LengthRequiredError;