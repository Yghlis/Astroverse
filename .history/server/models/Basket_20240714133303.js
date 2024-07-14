import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Basket = sequelize.define('Basket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'baskets',
  timestamps: true
});

export default Basket;
