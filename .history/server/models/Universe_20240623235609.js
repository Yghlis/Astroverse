import sequelize from '../config/database.js';

const Universe = sequelize.define('Universe', {

}, {
  timestamps: false,
  tableName: 'universes'
});

export default Universe;
