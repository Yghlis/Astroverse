'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('baskets', 'firstItemAddedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('baskets', 'firstItemAddedAt');
  }
};
