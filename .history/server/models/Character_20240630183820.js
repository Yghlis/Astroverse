import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Universe from './Universe.js';

const Character = sequelize.define('Character', {
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
  universe: {
    type: DataTypes.UUID,
    references: {
      model: Universe,
      key: 'id',
    },
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'characters'
});

export default Character;
