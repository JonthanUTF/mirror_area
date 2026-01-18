const { DataTypes } = require('sequelize');

// Note: This model is for caching metadata and OAuth tokens if needed.
// The source of truth for definitions is the ServiceRegistry code.
const Service = (sequelize) => {
    return sequelize.define('Service', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'services',
        timestamps: true
    });
};

module.exports = Service;
