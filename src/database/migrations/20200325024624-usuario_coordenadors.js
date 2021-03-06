module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("usuario_coordenadors", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      cod_pessoa: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
    return queryInterface.dropTable("usuario_coordenadors");
  }
};
