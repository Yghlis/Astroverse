import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Universe from './Universe.js';

const Character = sequelize.define('Character', {
 
})

Universe.hasMany(Character, { foreignKey: 'universe' });
Character.belongsTo(Universe, { foreignKey: 'universe' });

export default Character;
