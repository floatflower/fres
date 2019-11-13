const Column = require('./column');
const SmallIntColumn = require('./numeric-type/smallint');
const BigIntegerColumn = require('./numeric-type/bigint');
const BigSerialColumn = require('./numeric-type/bigserial');
const DecimalColumn = require('./numeric-type/decimal');
const DoublePrecisionColumn = require('./numeric-type/double-precision');
const IntegerColumn = require('./numeric-type/integer');
const NumericColumn = require('./numeric-type/numeric');
const RealColumn = require('./numeric-type/real');
const SerialColumn = require('./numeric-type/serial');
const MoneyColumn = require('./monetary-type/money');
const CharacterVaryingColumn = require('./character-type/character-varying');
const CharacterColumn = require('./character-type/charater');
const TextColumn = require('./character-type/text');
const ByteaColumn = require('./binary-data-type/bytea');
const TimestampWithoutTimezoneColumn = require('./date-time-type/datetime-without-timezone');
const TimestampWithTimezoneColumn = require('./date-time-type/datetime-with-timezone');
const DateColumn = require('./date-time-type/date');
const TimeWithoutTimezoneColumn = require('./date-time-type/time-without-timezone');
const TimeWithTimezoneColumn = require('./date-time-type/time-with-timezone');
const IntervalColumn = require('./date-time-type/interval');
const BooleanTypeColumn = require('./boolean-type/boolean');
const JsonColumn = require('./json-type/json');
const JsonbColumn = require('./json-type/jsonb');
const UUIDColumn = require('./uuid-type/uuid');
const SmallSerialColumn = require('./numeric-type/smallserial');

module.exports = (name, type) => {
    switch(type) {
        case 'smallint': return new SmallIntColumn(name);
        case 'integer': return new IntegerColumn(name);
        case 'bigint': return new BigIntegerColumn(name);
        case 'decimal': return new DecimalColumn(name);
        case 'numeric': return new NumericColumn(name);
        case 'real': return new RealColumn(name);
        case 'double precision': return new DoublePrecisionColumn(name);
        case 'smallserial': return new SmallSerialColumn(name);
        case 'serial': return new SerialColumn(name);
        case 'bigserial': return BigSerialColumn(name);
        case 'money': return new MoneyColumn(name);
        case 'character varying': return new CharacterVaryingColumn(name);
        case 'character': return new CharacterColumn(name);
        case 'text': return new TextColumn(name);
        case 'bytea': return new ByteaColumn(name);
        case 'timestamp without time zone': return new TimestampWithoutTimezoneColumn(name);
        case 'timestamp with time zone': return new TimestampWithTimezoneColumn(name);
        case 'date': return new DateColumn(name);
        case 'time without time zone': return new TimeWithoutTimezoneColumn(name);
        case 'time with time zone': return new TimeWithTimezoneColumn(name);
        case 'interval': return new IntervalColumn(name);
        case 'boolean': return new BooleanTypeColumn(name);
        case 'json': return new JsonColumn(name);
        case 'jsonb': return new JsonbColumn(name);
        case 'uuid': return new UUIDColumn(name);
        default:
            return new Column(name, type)
    }
};