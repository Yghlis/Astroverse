import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Universe from './Universe.js';
import Character from './Character.js';

const Product = sequelize.define('Product', {
 
}

Universe.hasMany(Product, { foreignKey: 'universe' });
Product.belongsTo(Universe, { foreignKey: 'universe' });

Character.hasMany(Product, { foreignKey: 'character' });
Product.belongsTo(Character, { foreignKey: 'character' });

export default Product;
