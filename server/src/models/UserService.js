const { DataTypes } = require('sequelize');

const UserService = (sequelize) => {
    return sequelize.define('UserService', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        serviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'services',
                key: 'id'
            }
        },
        accessToken: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        profileId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'user_services',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'serviceId']
            }
        ]
    });
};

module.exports = UserService;
