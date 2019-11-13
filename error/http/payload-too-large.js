const HTTPError = require('./http-error');

class PayloadTooLargeError extends HTTPError
{
    constructor(code, detail = null) {
        super(413, code, detail);
    }
}

module.exports = PayloadTooLargeError;