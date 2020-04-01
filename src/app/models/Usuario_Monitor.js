import Sequelize, { Model } from "sequelize";

class Usuario_monitor extends Model {
  static init(sequelize) {
    super.init(
      {
        tipo: Sequelize.STRING
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