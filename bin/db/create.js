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

knex.raw(`CREATE DATABASE ${process.env.DB_NAME};`)
    .then(function(){
        knex.destroy();

    }).finally(() => {
    console.log(`Database: ${process.env.DB_NAME} created successfully.`)
}).catch((error) => {
    console.log(error.toString());
    process.exit(-1);
});
