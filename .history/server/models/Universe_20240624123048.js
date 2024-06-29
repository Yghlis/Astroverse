import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Universe = sequelize.define('Universe', {

}, {
  timestamps: false,
  tableName: 'universes'
});

export default Universe;
