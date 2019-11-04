const HTTPError = require('./http-error');

class MisdirectedRequest extends HTTPError
{
    constructor(code, detail = null) {
        super(421, code, detail);
    }
}

module.exports = MisdirectedRequest;