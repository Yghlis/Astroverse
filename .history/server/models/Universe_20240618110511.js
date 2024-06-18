// models/Universe.js
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
    unique: true  // Ajoute une contrainte d'unicité
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
