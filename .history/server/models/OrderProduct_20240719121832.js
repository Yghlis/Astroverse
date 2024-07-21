import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderProduct = sequelize.define('OrderProduct', {
  orderId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default OrderProduct;
