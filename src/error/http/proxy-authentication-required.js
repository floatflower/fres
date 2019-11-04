const HTTPError = require('./http-error');

class ProxyAuthenticationRequired extends HTTPError
{
    constructor(code, detail = null) {
        super(407, code, detail);
    }
}

module.exports = ProxyAuthenticationRequired;