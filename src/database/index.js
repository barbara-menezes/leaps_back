import Sequelize from "sequelize";

import databaseConfig from '../config/database';
import Tipo_Usuario from "../app/models/Tipo_Usuario";
import Usuario from "../app/models/Usuario";
import Usuario_Monitor from "../app/models/Usuario_Monitor";
import Usuario_Coordenador from "../app/models/Usuario_Coordenador";
import Token_Senha from "../app/models/Token_Senha";
import Disciplina from "../app/models/Disciplina";
import Aluno from "../app/models/Aluno";
import Lista_Espera from "../app/models/Lista_Espera"
require('dotenv').config()

const models = [
  Tipo_Usuario,
  Usuario,
  Usuario_Monitor,
  Usuario_Coordenador,
  Token_Senha,
  Disciplina,
  Aluno,
  Lista_Espera
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    
    this.connection = new Sequelize(process.env.DATABASE_URL,{
      dialect: 'postgres',
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
      },
    });
    

    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
