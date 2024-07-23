import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'user_id',
    },
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.20,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('En attente', 'En cours', 'Expédiée', 'Livrée', 'Échouée', 'Retour demandée', 'Retour reçue', 'Remboursée'),
    defaultValue: 'En attente',
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

export default Order;
