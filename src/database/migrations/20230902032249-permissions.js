"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("permissions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        allowNull: false,
      },
      write_action: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      read_action: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      update_action: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      delete_action: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("permissions");
  },
};
