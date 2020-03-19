module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('token_senhas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id', 
        },
        onDelete:'CASCADE',
        onUpdate: "CASCADE",
      },
      dt_expiracao: {
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

  down: (queryInterface) => {
    return queryInterface.dropTable('token_senhas');
  }
};
