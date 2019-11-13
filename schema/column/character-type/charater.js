const Column = require('../column');

class CharacterColumn extends Column
{
    constructor(name) {
        super(name, 'character');
        this.maxLength = 0;
    }

    setColumnInfo(info) {
        super.setColumnInfo(info);
        this.maxLength = info.character_maximum_length;
    }
}

module.exports = CharacterColumn;