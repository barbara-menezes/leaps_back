module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("emprestimos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_devolucao: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      retorno_previsto: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("emprestimos");
  },
};