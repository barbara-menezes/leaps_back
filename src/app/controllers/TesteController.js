import * as Yup from "yup";
import Sequelize from 'sequelize';
import Teste from "../models/Teste";
const Op = Sequelize.Op;

class TesteController {
  async store(req, res) {

    const testeExist = await Teste.findOne({
      where: {
        codigo: req.body.teste.codigo
      },
    });

    if (testeExist) {
      return res.status(200).json({
        error: "Teste já cadastrado."
      });
    }

    await Teste.create({
        nome: req.body.teste.nome,
        codigo: req.body.teste.codigo,
        status: req.body.teste.status
      })
      .then(teste => {
        return res.status(201).json({
          teste: {
            id: teste.id,
            nome: teste.nome,
            codigo: teste.codigo,
            status: teste.status
          }
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    await Teste.findAll()
      .then(teste => {
        return res.status(201).json({
          teste
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async delete(req, res) {
    const teste = await Teste.findOne({
      where: {
        id: req.params.id
      },
    });
    teste.destroy()
    const deleted = await Teste.findAll()
    return res.json(deleted);
  }
}

export default new TesteController();