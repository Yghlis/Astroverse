'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Follows', {
      fields: ['userId', 'productId'],
      type: 'unique',
      name: 'follows_unique_user_product'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Follows', 'follows_unique_user_product');
  }
};
