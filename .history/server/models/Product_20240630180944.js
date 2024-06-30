import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Character from './Character.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discounted_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  is_promotion: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  characterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Character,
      key: 'id',
    },
  },
  universe: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Universes', // Assurez-vous que le nom de la table Universes est correct
      key: 'id',
    },
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  availability_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  views_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (product) => {
      product.availability_status = product.stock > 0 ? 'En stock' : 'En rupture de stock';
    },
    beforeUpdate: (product) => {
      product.availability_status = product.stock > 0 ? 'En stock' : 'En rupture de stock';
    },
  }
});

Character.hasMany(Product, { foreignKey: 'characterId', as: 'products' });
Product.belongsTo(Character, { foreignKey: 'characterId', as: 'character' });

export default Product;
