import Sequelize, { Model } from "sequelize";

class Espera_Lista extends Model {
  static init(sequelize) {
    super.init(
      {
        codigo: Sequelize.STRING,
        status: Sequelize.STRING
      },
      {
        sequelize
      }
    );
    return this;
  }
}

export default Espera_Lista;
