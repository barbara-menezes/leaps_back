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
  static associate (models){
    this.belongsToMany(models.Disciplina, { through:"aluno_disciplinas", as:"disciplinas", foreignKey: 'id_aluno'});
  };
}

export default Aluno;