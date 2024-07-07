'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ajouter les colonnes created_at et updated_at à la table Newsletters
    await queryInterface.addColumn('Newsletters', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('Newsletters', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    // Vérifier l'existence de la colonne isSubscribedToNewsletter dans la table Users avant de l'ajouter
    const tableDescription = await queryInterface.describeTable('Users');
    if (!tableDescription.isSubscribedToNewsletter) {
      await queryInterface.addColumn('Users', 'isSubscribedToNewsletter', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Supprimer les colonnes created_at et updated_at de la table Newsletters
    await queryInterface.removeColumn('Newsletters', 'created_at');
    await queryInterface.removeColumn('Newsletters', 'updated_at');

    // Vérifier l'existence de la colonne isSubscribedToNewsletter dans la table Users avant de la supprimer
    const tableDescription = await queryInterface.describeTable('Users');
    if (tableDescription.isSubscribedToNewsletter) {
      await queryInterface.removeColumn('Users', 'isSubscribedToNewsletter');
    }
  }
};
