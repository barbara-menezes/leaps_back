module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("aluno_disciplinas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_aluno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "alunos",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      id_disciplina: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "disciplinas",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("aluno_disciplinas");
  }
};
