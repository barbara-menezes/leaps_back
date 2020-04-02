import Sequelize, {
  Model
} from "sequelize";

class Disciplina extends Model {
  static init(sequelize) {
    super.init({
      nome_disciplina: Sequelize.STRING,
      turno: Sequelize.STRING,
      periodo: Sequelize.STRING,
      codigo: Sequelize.STRING,
    }, {
      sequelize,
      tableName: 'disciplinas',
    });
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Aluno, {
      foreignKey: 'id_disciplina',
      through: 'aluno_disciplinas',
      as: 'alunos',
    });
  };

}

export default Disciplina;