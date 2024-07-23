'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Vérifiez si la colonne 'phoneNumber' existe déjà
    const tableInfo = await queryInterface.describeTable('orders');

    if (!tableInfo.phoneNumber) {
      await queryInterface.addColumn('orders', 'phoneNumber', {
        type: DataTypes.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimez la colonne 'phoneNumber' seulement si elle existe
    const tableInfo = await queryInterface.describeTable('orders');

    if (tableInfo.phoneNumber) {
      await queryInterface.removeColumn('orders', 'phoneNumber');
    }
  },
};
