const Column = require('../column');

class CharacterVaryingColumn extends Column
{
    constructor(name) {
        super(name, 'character-varying');
        this.maxLength = 0;
    }

    setColumnInfo(info) {
        super.setColumnInfo(info);
        this.maxLength = info.character_maximum_length;
    }
}

module.exports = CharacterVaryingColumn;