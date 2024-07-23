'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', // Corrigé pour correspondre au nom correct de la table
          key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shippingAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      billingAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      products: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.20,
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('En attente', 'En cours', 'Expédiée', 'Livrée', 'Échouée', 'Retour demandée', 'Retour reçue', 'Remboursée'),
        defaultValue: 'En attente',
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
