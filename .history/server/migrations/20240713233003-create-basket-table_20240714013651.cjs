'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('basket', {
      id_basket: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_user: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', // nom de la table users
          key: 'user_id'
        }
      },
      id_session: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_product: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Products', // nom de la table products
          key: 'id'
        }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('basket');
  }
};
