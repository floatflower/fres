const HTTPError = require('./http-error');

class UpgradeRequiredError extends HTTPError
{
    constructor(code, detail = null) {
        super(426, code, detail);
    }
}

module.exports = UpgradeRequiredError;