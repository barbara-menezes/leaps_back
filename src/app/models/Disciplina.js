import Sequelize, { Model } from "sequelize";

class Disciplina extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_disciplina: Sequelize.STRING,
        turno: Sequelize.STRING,
        periodo: Sequelize.INTEGER,
        codigo: Sequelize.INTEGER,
      },
      {
        sequelize
      }
    );
    return this;
  }
}



export default Disciplina;
