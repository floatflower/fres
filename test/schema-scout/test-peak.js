const moment = require('moment');
const chai = require('chai');
const assert = chai.assert;

const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'dev']);
const schemaScout = require('../../schema/scout');
const schema = require('../../schema');


describe('Test SchemaScout peak()', () => {

    before(() => {
        return knex.schema.createTable('test', (table) => {
            // table.increments('inc_test');
            table.integer('int_test');
            table.bigIncrements('bigint_test');
            table.text('text_test');
            table.string('str_test').unique();
            table.string('char_test', 16);
            table.float('float_test');
            table.decimal('decimal_test');
            table.boolean('boolean_test');
            table.date('date_test');
            table.dateTime('datetime_test');
            table.time('time_test');
            table.timestamp('timestamp_test');
            table.binary('bin_test');
            table.enum('enum_test', ['foo', ['bar']]);
            table.json('json_test');
            table.jsonb('jsonb_test');
            table.uuid('uuid_test');

        })
    });

    after(() => {
        return knex.schema.dropTableIfExists('test');
    });

    it('can peak when migrations has migrations script name', (done) => {
        schemaScout.peak().then(() => {
            schema.tables.forEach(table => {
                // console.log(table.columns);
            });
            done();
        });
    });
});