import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Universe = sequelize.define('Universe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  color1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color2: {
    type: DataTypes.STRING,
    allowNull: false
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
