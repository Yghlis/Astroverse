// models/Product.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
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
  number_of_purchases: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  number_of_favorites: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  image_preview: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_gallery: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  character: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  universe: {
    type: DataTypes.UUID,
    allowNull: false,
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
  }
}, {
  timestamps: true,
});

export default Product;
