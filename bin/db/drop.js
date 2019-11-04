require('dotenv').config();
var kenxFile = require('../../knexfile');
var conn = {
    host     : kenxFile[process.env.NODE_ENV].connection.host,
    user     : kenxFile[process.env.NODE_ENV].connection.user,
    password : kenxFile[process.env.NODE_ENV].connection.password,
    database : kenxFile[process.env.NODE_ENV].connection.initDBName || 'postgres'
};

// connect without database selected
var knex = require('knex')({ client: 'pg', connection: conn});

knex.raw(`DROP DATABASE ${kenxFile[process.env.NODE_ENV].connection.database};`)
    .then(function(){
        knex.destroy();

        // connect with database selected
        conn.database = kenxFile[process.env.NODE_ENV].connection.database;
        knex = require('knex')({ client: 'pg', connection: conn});
    }).finally(() => {
    console.log(`Database: ${kenxFile[process.env.NODE_ENV].connection.database} dropped successfully.`)
}).catch((error) => {
    console.log(error.toString());
    process.exit(-1);
});