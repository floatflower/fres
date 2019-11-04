const RequestHandlerError = require('./request-handler-error');

class RequestFieldFormatInvalid extends RequestHandlerError
{
    constructor(code, detail = null) {
        super(code, detail)
    }
}

module.exports = RequestFieldFormatInvalid;