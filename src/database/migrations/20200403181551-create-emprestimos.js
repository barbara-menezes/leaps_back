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
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_devolucao: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      data: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      retorno_previsto: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("emprestimos");
  },
};