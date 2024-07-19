import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderProduct = sequelize.define('OrderProduct', {
  orderId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'orders',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'products',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

export default OrderProduct;
