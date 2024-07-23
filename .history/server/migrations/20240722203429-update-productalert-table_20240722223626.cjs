'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Products');
    if (!tableInfo.alert_stock) {
      await queryInterface.addColumn('Products', 'alert_stock', {
        type: Sequelize.INTEGER,
        allowNull: false,  // ou true si ce champ est facultatif
        defaultValue: 10,   
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Products');
    if (tableInfo.alert_stock) {
      await queryInterface.removeColumn('Products', 'alert_stock');
    }
  }
};
