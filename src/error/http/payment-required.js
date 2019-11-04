const HTTPError = require('./http-error');

class PaymentRequiredError extends HTTPError
{
    constructor(code, detail = null) {
        super(402, code, detail);
    }
}

module.exports = PaymentRequiredError;