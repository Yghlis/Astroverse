const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct

const Basket = sequelize.define('Basket', {
  id_basket: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_user: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  id_session: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_product: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'basket',
  timestamps: false
});

module.exports = Basket;
