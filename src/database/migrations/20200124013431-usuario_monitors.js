module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("usuario_monitors", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      matricula: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      telefone_celular:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      dt_nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      materia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
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
    return queryInterface.dropTable("usuario_monitors");
  }
};
