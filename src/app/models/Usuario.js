import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        usuario: Sequelize.STRING,
        senha: Sequelize.STRING,
        id_tipo_usuario: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }

  checkPassword(senha) {
    return bcrypt.compare(senha, this.senha);
  }

  static associate(models) {
    this.hasOne(models.Tipo_usuario, {
      foreignKey: "id_tipo_usuario",
      as: "Tipo_Usuario"
    });
    //this.belongsTo(models.Usuario_pcd, {as:"Usuario_Pcd", onDelete: "cascade"})
  }
}

export default Usuario;
