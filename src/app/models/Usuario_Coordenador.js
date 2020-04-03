import Sequelize, { Model } from "sequelize";

class Usuario_coordenador extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_pessoa: Sequelize.STRING
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

export default Usuario_coordenador;