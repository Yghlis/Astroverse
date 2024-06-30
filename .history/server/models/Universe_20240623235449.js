import sequelize from '../config/database.js';

const Universe = sequelize.define('Universe', {
 
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
