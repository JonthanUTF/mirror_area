const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'area_db',
  process.env.DB_USER || 'area',
  process.env.DB_PASSWORD || 'area',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

const Area = sequelize.define('Area', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  actionService: {
    type: DataTypes.STRING,
    allowNull: false
  },
  actionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reactionService: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reactionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parameters: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastTriggered: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'areas',
  timestamps: true
});

User.hasMany(Area, { foreignKey: 'userId', as: 'areas' });
Area.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const Service = require('./Service')(sequelize);
const UserService = require('./UserService')(sequelize);

User.belongsToMany(Service, { through: UserService, foreignKey: 'userId', as: 'connectedServices' });
Service.belongsToMany(User, { through: UserService, foreignKey: 'serviceId', as: 'users' });

User.hasMany(UserService, { foreignKey: 'userId', as: 'serviceConnections' });
UserService.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Service.hasMany(UserService, { foreignKey: 'serviceId', as: 'connections' });
UserService.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });


const db = {
  sequelize,
  Sequelize,
  User,
  Area,
  Service,
  UserService
};

module.exports = db;
