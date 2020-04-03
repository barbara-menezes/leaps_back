import * as Yup from "yup";
import Sequelize from 'sequelize';
import Teste from "../models/Teste";
import Emprestimo from "../models/Emprestimo";
const Op = Sequelize.Op;

class TesteController {

  async store(req, res) {
    await Teste.create({
        nome: Sequelize.STRING,
        codigo: Sequelize.STRING,
        status: Sequelize.STRING,
      }, )
      .then(teste => {
        return res.status(201).json({
          teste: {
            id: teste.id,
            nome: teste.nome,
            codigo: teste.codigo,
            status: teste.status,
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

  async index_relationship(req, res) {
    const {
      emprestimo_id
    } = req.params;

    const emprestimo = await Emprestimo.findByPk(emprestimo_id, {
      include: {
        association: 'testes',
        attributes: ['id', 'nome', 'codigo', 'status'],
        through: {
          attributes: []
        }
      }
    })
    return res.json(emprestimo.testes);
  }

  async store_relationship(req, res) {

    const {
      emprestimo_id
    } = req.params;

    const emprestimo = await Emprestimo.findByPk(emprestimo_id);

    if (!emprestimo) {
      return res.status(400).json({
        error: 'Empréstimo não encontrado'
      });
    }

    const teste = await Teste.findOrCreate({
      where: {
        id: req.params.id,
        nome: req.body.nome,
        codigo: req.body.codigo,
        status: req.body.status,
      }
    });

    await emprestimo.addTeste(teste);

    return res.json(teste);
  }

  async delete_relationship(req, res) {

    const {
      emprestimo_id
    } = req.params;

    const emprestimo = await Emprestimo.findByPk(emprestimo_id);

    if (!emprestimo) {
      return res.status(400).json({
        error: 'Empréstimo não encontrado'
      });
    }

    const teste = await Teste.findOne({
      where: {
        id: req.params.id,
        nome: req.body.nome,
        codigo: req.body.codigo,
        status: req.body.status,
      }
    });

    await emprestimo.removeTeste(teste);
    return res.json(teste);
  }


}

export default new TesteController();