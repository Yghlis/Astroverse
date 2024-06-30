import Character from './Character.js';
import Product from './Product.js';
import Universe from './Universe.js';

// Define associations here
Universe.hasMany(Character, { foreignKey: 'universe' });
Character.belongsTo(Universe, { foreignKey: 'universe' });
Character.hasMany(Product, { foreignKey: 'character', as: 'products' });
Product.belongsTo(Character, { foreignKey: 'character', as: 'characterDetails' });
Universe.hasMany(Product, { foreignKey: 'universe', as: 'universeProducts' });
Product.belongsTo(Universe, { foreignKey: 'universe', as: 'universeDetails' });

export { Character, Product, Universe };
