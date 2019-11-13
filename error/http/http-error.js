class HTTPError extends Error {

    constructor(status, code = 10000, detail = null) {
        super();
        this.code = code;
        this.status = status;
        this.detail = detail;
    }

}

module.exports = HTTPError;