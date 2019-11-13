const RequestHandlerError = require('./request-handler-error');

class RequestFieldNotProvided extends RequestHandlerError
{
    constructor(code, detail = null) {
        super(code, detail)
    }
}

module.exports = RequestFieldNotProvided;