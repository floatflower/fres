const HTTPError = require('./http-error');

class UnsupportedMediaTypeError extends HTTPError
{
    constructor(code, detail = null) {
        super(415, code, detail);
    }
}

module.exports = UnsupportedMediaTypeError;