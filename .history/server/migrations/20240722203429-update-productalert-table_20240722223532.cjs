'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'alert_stock', {
      type: Sequelize.INTEGER,
      allowNull: false,  // ou true si ce champ est facultatif
      defaultValue: 0,   // si vous voulez une valeur par défaut
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'alert_stock');
  }
};
