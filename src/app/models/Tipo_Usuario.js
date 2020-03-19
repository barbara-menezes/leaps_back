import Sequelize, { Model } from 'sequelize';

class Tipo_usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        tipo: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}



export default Tipo_usuario;
