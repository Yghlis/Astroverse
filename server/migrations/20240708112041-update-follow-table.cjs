'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [results] = await queryInterface.sequelize.query(`
      SELECT conname 
      FROM pg_constraint 
      WHERE conname = 'follows_unique_user_product'
    `);

    if (results.length === 0) {
      await queryInterface.addConstraint('Follows', {
        fields: ['userId', 'productId'],
        type: 'unique',
        name: 'follows_unique_user_product'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Follows', 'follows_unique_user_product');
  }
};
