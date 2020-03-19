import Sequelize from "sequelize";

import databaseConfig from '../config/database';
import Tipo_Usuario from "../app/models/Tipo_Usuario";
import Usuario from "../app/models/Usuario";
import Usuario_Monitor from "../app/models/Usuario_Monitor";
import Token_Senha from "../app/models/Token_Senha";
import Disciplina from "../app/models/Disciplina"
require('dotenv').config()

const models = [
  Tipo_Usuario,
  Usuario,
  Usuario_Monitor,
  Token_Senha,
  Disciplina
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
