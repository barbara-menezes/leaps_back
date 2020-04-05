import Sequelize, {
  Model
} from "sequelize";

class Teste extends Model {
  static init(sequelize) {
    super.init({
      nome: Sequelize.STRING,
      codigo: Sequelize.STRING,
      status: Sequelize.STRING,
    }, {
      sequelize,
      tableName: 'testes',
    });
    return this;
  }
  // static associate(models) {
  //   this.belongsToMany(models.Emprestimo, {
  //     through: "teste_emprestimos",
  //     as: "emprestimos",
  //     foreignKey: 'teste_id'
  //   });
  // };
}

export default Teste;