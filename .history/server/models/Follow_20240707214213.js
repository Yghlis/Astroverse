import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  universeId: {
    type: DataTypes.UUID,
    allowNull: true,
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

export default Follow;
