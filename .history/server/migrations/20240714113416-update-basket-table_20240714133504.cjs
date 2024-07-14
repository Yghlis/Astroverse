'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Créer la table si elle n'existe pas
    await queryInterface.createTable('Baskets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      items: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Si la table existe déjà, effectuer les modifications nécessaires
    await queryInterface.addColumn('Baskets', 'items', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: []
    });

    // Supprimer les anciennes colonnes si elles existent
    await queryInterface.removeColumn('Baskets', 'id_product');
    await queryInterface.removeColumn('Baskets', 'quantity');
    await queryInterface.removeColumn('Baskets', 'timestamp');
  },

  down: async (queryInterface, Sequelize) => {
    // Restaurer les anciennes colonnes lors de la migration vers le bas
    await queryInterface.addColumn('Baskets', 'id_product', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Baskets', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.addColumn('Baskets', 'timestamp', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    });

    await queryInterface.removeColumn('Baskets', 'items');

    await queryInterface.dropTable('Baskets');
  }
};
