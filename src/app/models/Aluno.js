import Sequelize, { Model } from "sequelize";

class Aluno extends Model {
  static init(sequelize) {
    super.init(
      {
        matricula: Sequelize.STRING,
        nome:Sequelize.STRING,
        telefone: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize
      }
    );
    return this;
  }
}

export default Aluno;