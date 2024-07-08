import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';
import Product from './Product.js';
import Universe from './Universe.js';

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Product,
      key: 'id',
    },
  },
  universeId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Universe,
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'Follows',
  validate: {
    oneReference() {
      if ((this.productId && this.universeId) || (!this.productId && !this.universeId)) {
        throw new Error('Follow must reference either a product or a universe, but not both.');
      }
    }
  }
});

// Ajouter l'association avec User
Follow.belongsTo(User, { foreignKey: 'userId' });

export default Follow;
