const HTTPError = require('./http-error');

class UnavailableForLegalReasonsError extends HTTPError
{
    constructor(code, detail = null) {
        super(451, code, detail);
    }
}

module.exports = UnavailableForLegalReasonsError;