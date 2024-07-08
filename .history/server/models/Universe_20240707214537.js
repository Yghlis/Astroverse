import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Universe = sequelize.define('Universe', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  color2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  colorText: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'universes'
});

export default Universe;
