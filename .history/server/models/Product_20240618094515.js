import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Universe from './Universe.js';
import Character from './Character.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discounted_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  is_promotion: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  number_of_purchases: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  number_of_favorites: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true
  },
  image_preview: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image_gallery: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  character: {
    type: DataTypes.UUID,
    references: {
      model: Character,
      key: 'id',
    },
    allowNull: false,
  },
  universe: {
    type: DataTypes.UUID,
    references: {
      model: Universe,
      key: 'id',
    },
    allowNull: false,
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  availability_status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true, // Let Sequelize manage createdAt and updatedAt
  tableName: 'products'
});

Universe.hasMany(Product, { foreignKey: 'universe' });
Product.belongsTo(Universe, { foreignKey: 'universe' });

Character.hasMany(Product, { foreignKey: 'character' });
Product.belongsTo(Character, { foreignKey: 'character' });

export default Product;
