class Situation
{
    constructor(name) {
        this.m_name = name;
        this.seeders = [];
    }

    register(seedFunction) {
        const knex = require('../../knex');
        let action = seedFunction(knex);
        this.seeders.push(action);
    }

    build() {
        return new Promise((resolve, reject) => {
            let p = Promise.resolve();
            this.seeders.forEach(seeder => {
                p = p.then(() => { return seeder; })
            });

            p.then(resolve, reject);
        });
    }
}

module.exports = Situation;