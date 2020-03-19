module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("disciplinas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nome_disciplina: {
        type: Sequelize.STRING,
        allowNull: false
      },
      turno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      periodo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      codigo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
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
    return queryInterface.dropTable("disciplinas");
  }
};
