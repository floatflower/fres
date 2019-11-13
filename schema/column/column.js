class Column
{
    constructor(name, type) {
        this.m_name = name;
        this.m_type = type;
        this.m_isUnique = false;
        this.m_isPrimary = false;
        this.m_isNullable = null;
        this.m_isUpdatable = null;
    }

    set name(value) { this.m_name = value; }
    set isUnique(value) { this.m_isUnique = value; }
    set isPrimary(value) { this.m_isPrimary = value; }
    set type(value) { this.m_type = value; }
    set isNullable(value) { this.m_isNullable = value; }
    set isUpdatable(value) { this.m_isUpdatable = value; }

    get name() { return this.m_name; }
    get isUnique() { return this.m_isUnique; }
    get isPrimary() { return this.m_isPrimary; }
    get type() { return this.m_type; }
    get isNullable() { return this.m_isNullable; }
    get isUpdatable() { return this.m_isUpdatable; }

    setColumnInfo(info) {
        this.isUpdatable = info.is_updatable === 'YES';
        this.isNullable = info.is_nullable === 'YES';
    }

    setConstraint(constraint) {
        if(constraint.constraint_type === 'PRIMARY_KEY') {
            this.isPrimary = true;
        }
        if(constraint.constraint_type === 'UNIQUE') {
            this.isUnique = true;
        }
    }
}

module.exports = Column;