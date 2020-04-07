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

  async showById(req, res) {
    await Teste.findOne({
        where: {
          id: req.params.id
        }
      })
      .then(teste => {
        return res.status(201).json({
          teste
        });
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async indexByQuery(req, res) {

    let query = req.params.query.split('+');
    let teste = [];
    for (let i = 0; i < query.length; i++) {
      teste.push(await Teste.findAll({
        where: {
          codigo: {
            [Op.iLike]: "%" + query[i] + "%"
          }
        },
        attributes: ['nome', 'codigo', 'status'],
      }))
    }

    if (teste) {
      return res.status(200).json(teste);
    } else {
      return res.status(200).json({
        error: "Nenhuma teste encontrado"
      });
    }
  }

  async update(req, res) {
    const idExist = await Teste.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!idExist) {
      return res.status(200).json({
        error: "Id da Teste informada nao existe",
      });
    }

    Teste.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then(async (teste) => {
        if (teste) {
          await teste.update(req.body.teste);
          return res.status(201).json({
            teste,
          });
        } else {
          return res.status(200).json({
            error: "Teste não encontrado.",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          error: "Erro no servidor.",
        });
      });
  }


}



export default new TesteController();