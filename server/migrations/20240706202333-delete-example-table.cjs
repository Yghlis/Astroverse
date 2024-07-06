'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ExampleTable');
  },
  down: async (queryInterface, Sequelize) => {
    // Laisser vide ou ajouter une opération inverse si nécessaire
  }
};
