'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Newsletters');

    if (!tableInfo.created_at) {
      await queryInterface.addColumn('Newsletters', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    if (!tableInfo.updated_at) {
      await queryInterface.addColumn('Newsletters', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Newsletters');

    if (tableInfo.created_at) {
      await queryInterface.removeColumn('Newsletters', 'created_at');
    }

    if (tableInfo.updated_at) {
      await queryInterface.removeColumn('Newsletters', 'updated_at');
    }
  }
};
