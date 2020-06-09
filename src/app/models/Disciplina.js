import Sequelize, { Model } from "sequelize";

class Disciplina extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_disciplina: Sequelize.STRING,
        turno: Sequelize.STRING,
        periodo: Sequelize.STRING,
        codigo: Sequelize.STRING,
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate (models){
    this.belongsToMany(models.Aluno, { through:"aluno_disciplinas", as:"alunos", foreignKey: 'id_disciplinas'});
  };
}



export default Disciplina;
