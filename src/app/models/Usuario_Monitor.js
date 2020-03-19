import Sequelize, { Model } from "sequelize";

class Usuario_monitor extends Model {
  static init(sequelize) {
    super.init(
      {
        matricula: Sequelize.STRING,
        telefone_celular:Sequelize.STRING,
        dt_nascimento: Sequelize.DATE,
        materia: Sequelize.STRING,
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate (models){
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
  };
}

export default Usuario_monitor;