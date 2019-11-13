class RequestHandlerError extends Error
{
    constructor(code, detail = null) {
        super();
        this.code = code;
        this.detail = detail
    }
}

module.exports = RequestHandlerError;