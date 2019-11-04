require('colors');

class Concurrent
{
    constructor(totalRequests = 100, concurrent = 10) {
        this.m_totalRequests = totalRequests;
        this.m_concurrent = concurrent;
        this.m_current = 0;
    }

    set totalRequests(value) { this.m_totalRequests = value; }
    set concurrent(value) { this.m_concurrent = value; }

    action(callback) {
        return new Promise((resolve, reject) => {
            if(this.m_current >= this.m_totalRequests) resolve();
            else {
                let eachActionTime = this.m_totalRequests - this.m_current < this.m_concurrent ?
                    (this.m_totalRequests - this.m_current) : this.m_concurrent;
                this.m_current += this.m_concurrent;
                let eachActions = [];
                for (let j = 0; j < eachActionTime; j++) {
                    eachActions.push(callback());
                }
                return Promise
                    .all(eachActions)
                    .then(() => {
                        console.log(`Finished ${this.m_current} actions of ${this.m_totalRequests} actions.`.green);
                    })
                    .then(() => this.action(callback), reject)
                    .then(resolve);
            }
        })
    }
}

module.exports = Concurrent;