import Sequelize, { Model } from 'sequelize';

class Token_senha extends Model {
  static init(sequelize) {
    super.init(
      {
        token: Sequelize.STRING,
        dt_expiracao: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
  }
}

export default Token_senha;