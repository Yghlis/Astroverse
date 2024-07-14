'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('baskets');
    if (!table.firstItemAddedAt) {
      await queryInterface.addColumn('baskets', 'firstItemAddedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('baskets');
    if (table.firstItemAddedAt) {
      await queryInterface.removeColumn('baskets', 'firstItemAddedAt');
    }
  }
};
