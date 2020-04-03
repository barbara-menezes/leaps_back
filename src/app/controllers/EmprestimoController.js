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
}

export default new EmprestimoController();