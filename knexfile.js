require("dotenv").config();

const db_connection = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    initDBName: process.env.DB_INIT
};

module.exports = {
    dev: {
        client: "pg",
        connection: db_connection,
        pool: { min: 0, max: 10 },
        seeds: {
            directory: "./src/seed/dev"
        },
        migrations: {
            tableName: "migrations",
            directory: './src/migration'
        }
    },
    production: {
        client: "pg",
        connection: db_connection,
        pool: { min: 0, max: 100 },
        seeds: {
            directory: "./src/seed/prod"
        },
        migrations: {
            tableName: "migrations",
            directory: './src/migration'
        }
    },
    test: {
        client: "pg",
        connection: db_connection,
        pool: { min: 0, max: 100 },
        seeds: {
            directory: "./src/seed/dev"
        },
        migrations: {
            tableName: "migrations",
            directory: './src/migration'
        }
    }
};

