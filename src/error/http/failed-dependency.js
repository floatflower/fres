const HTTPError = require('./http-error');

class FailedDependencyError extends HTTPError
{
    constructor(code, detail = null) {
        super(424, code, detail);
    }
}

module.exports = FailedDependencyError;