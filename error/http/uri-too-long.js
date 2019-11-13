const HTTPError = require('./http-error');

class URITooLongError extends HTTPError
{
    constructor(code, detail = null) {
        super(414, code, detail);
    }
}

module.exports = URITooLongError;