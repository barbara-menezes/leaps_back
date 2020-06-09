import Sequelize, { Model } from 'sequelize';

class Lista_espera extends Model {
  static init(sequelize) {
    super.init(
      {
        codigo: Sequelize.STRING,
        status: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}



export default Lista_espera;
