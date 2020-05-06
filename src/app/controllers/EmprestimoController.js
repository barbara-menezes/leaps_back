import Sequelize from 'sequelize';
import Emprestimo from "../models/Emprestimo";
const Op = Sequelize.Op;

class EmprestimoController {
  async store(req, res) {

    const emprestimo = await Emprestimo.findOne({
      where: {
        codigo: req.body.emprestimo.codigo
      }
    });

    if (emprestimo) {
      return res.status(200).json({
        error: "Empréstimo já cadastrado."
      });
    }

    await Emprestimo.create({
        codigo: req.body.emprestimo.codigo,
        status: req.body.emprestimo.status,
        data_devolucao: req.body.emprestimo.data_devolucao,
        data: req.body.emprestimo.data,
        retorno_previsto: req.body.emprestimo.retorno_previsto,
      })
      .then(emprestimo => {
        return res.status(201).json({
          emprestimo: {
            id: emprestimo.id,
            codigo: emprestimo.codigo,
            status: emprestimo.status,
            data_devolucao: emprestimo.data_devolucao,
            data: emprestimo.data,
            retorno_previsto: emprestimo.retorno_previsto,
          }
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    await Emprestimo.findAll()
      .then(emprestimo => {
        return res.status(201).json({
          emprestimo
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async update(req, res) {
    const idExist = await Emprestimo.findOne({
      where: {
        id: req.params.id,
      },
    });
 
    if (!idExist) {
      return res.status(200).json({
        error: "ID do Empréstimo informado não encontrado.",
      });
    }
 
    await Emprestimo.findOne({
        where: {
          id: req.params.id,
        },
      })
      .then(async (emprestimo) => {
        if (emprestimo) {
          await emprestimo.update(req.body.emprestimo);
          return res.status(201).json({
            emprestimo,
          });
        } else {
          return res.status(200).json({
            error: "Emprestimo não encontrado.",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          error: "Erro no servidor.",
        });
      });
  }
 
  async delete(req, res) {
    const emprestimo = await Emprestimo.findOne({
      where: {
        id: req.params.id
      }
    });
    await emprestimo.destroy().then(() => {
      return res.status(201).json({
        message: "Empréstimo deletado com sucesso!"
      });
    }).catch(err => {
      console.log("ERROR: " + err);
    });
  }
}

export default new EmprestimoController();