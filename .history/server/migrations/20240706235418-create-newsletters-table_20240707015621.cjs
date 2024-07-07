'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Créer la table Newsletters
    await queryInterface.createTable('Newsletters', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      pdfUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      }
    });

    // Ajouter la colonne isSubscribedToNewsletter à la table Users
    await queryInterface.addColumn('Users', 'isSubscribedToNewsletter', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // Supprimer la table Newsletters
    await queryInterface.dropTable('Newsletters');

    // Supprimer la colonne isSubscribedToNewsletter de la table Users
    await queryInterface.removeColumn('Users', 'isSubscribedToNewsletter');
  }
};
