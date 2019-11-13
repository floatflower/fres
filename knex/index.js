const knexFile = require(`${process.cwd()}/knexfile.js`);
const knex = require('knex')(knexFile[process.env.NODE_ENV]);

module.exports = knex;