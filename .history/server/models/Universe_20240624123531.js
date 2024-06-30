import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Universe = sequelize.define('Universe', {
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
  color1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  colorText: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'universes'
});

export default Universe;
