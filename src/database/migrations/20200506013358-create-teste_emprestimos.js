module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("teste_emprestimos", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_teste: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "testes",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      id_emprestimo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "emprestimos",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      created_at: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATEONLY,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("teste_emprestimos");
  }
};