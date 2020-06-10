import Sequelize, {
  Model
} from "sequelize";

class Emprestimo extends Model {
  static init(sequelize) {
    super.init({
      codigo: Sequelize.STRING,
      status: Sequelize.STRING,
      data_devolucao: Sequelize.DATE,
      data: Sequelize.DATE,
      retorno_previsto: Sequelize.DATE,
    }, {
      sequelize,
      tableName: 'emprestimos',
    });
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Teste, {
      through: "teste_emprestimos",
      as: "testes",
      foreignKey: 'id_emprestimo'
    });
    this.belongsToMany(models.Aluno, {
      through: "aluno_emprestimos",
      as: "alunos",
      foreignKey: 'id_emprestimo'
    });
  };
}

export default Emprestimo;