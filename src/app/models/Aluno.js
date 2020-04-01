import Sequelize, {
  Model
} from "sequelize";

class Aluno extends Model {
  static init(sequelize) {
    super.init({
      matricula: Sequelize.STRING,
      nome: Sequelize.STRING,
      telefone: Sequelize.STRING,
      email: Sequelize.STRING,
    }, {
      sequelize,
      tableName: 'alunos',
    });
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Disciplina, {
      foreignKey: 'id_aluno', //chave que faz esse relacionamento
      through: 'aluno_disciplinas', //tabela do relacionamento
      as: 'disciplinas', //nome do relacionamento
    });
  };
}

export default Aluno;