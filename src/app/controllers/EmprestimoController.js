import Sequelize from "sequelize";
// import {
//   startOfHour,
//   parseISO,
//   isBefore
// } from "date-fns";
import Emprestimo from "../models/Emprestimo";
import Teste from "../models/Teste";
import Aluno from "../models/Aluno";
const Op = Sequelize.Op;

class EmprestimoController {
  async store(req, res) {
    const emprestimo = await Emprestimo.findOne({
      where: {
        codigo: req.body.emprestimo.codigo,
      },
    });

    if (emprestimo) {
      return res.status(200).json({
        error: "Empréstimo já cadastrado.",
      });
    }

    /**
     * Verificação por datas passadas
     *
     * parseISO transforma 2020-05-21T23:59:00-03:00 para um objeto DATE javascript
     * startOfHour sempre pega o inicio da hora desconsiderando min e seg 23:59:00
     * apenas o 23:00:00
     *
     */
    // const hourStart = startOfHour(
    //   parseISO(
    //     req.body.emprestimo.data,
    //     req.body.emprestimo.data_devolucao,
    //     req.body.emprestimo.retorno_previsto
    //   )
    // );

    // verifica se a hora atual está antes da data atual
    // if (isBefore(hourStart, new Date())) {
    //   return res.status(400).json({
    //     error: "Past dates are not permitted",
    //   });
    // }

    /**
     * Verificação datas validas
     */
    // const checkAvailability = await Emprestimo.findOne({
    //   where: {

    //   },
    //   include: [{
    //     model: Teste,
    //     as: "testes",
    //   }, ],
    // });

    // if (checkAvailability) {
    //   return res.status(400).json({
    //     error: "Teste is not available",
    //   });
    // }

    await Emprestimo.create({
        codigo: req.body.emprestimo.codigo,
        status: req.body.emprestimo.status,
        data_devolucao: req.body.emprestimo.data_devolucao,
        data: req.body.emprestimo.data,
        retorno_previsto: req.body.emprestimo.retorno_previsto,
      })
      .then((emprestimo) => {
        return res.status(201).json({
          emprestimo: {
            id: emprestimo.id,
            codigo: emprestimo.codigo,
            status: emprestimo.status,
            data_devolucao: emprestimo.data_devolucao,
            data: emprestimo.data,
            retorno_previsto: emprestimo.retorno_previsto,
          },
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    await Emprestimo.findAll({
        include: [{
            model: Teste,
            as: "testes",
            attributes: ["nome", "codigo", "status"],
          },
          {
            model: Aluno,
            as: "alunos",
            attributes: ["id", "matricula", "nome", "email"],
          },
        ],
      })
      .then((emprestimo) => {
        return res.status(201).json({
          emprestimo,
        });
      })
      .catch((err) => {
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
        id: req.params.id,
      },
    });
    await emprestimo
      .destroy()
      .then(() => {
        return res.status(201).json({
          message: "Empréstimo deletado com sucesso!",
        });
      })
      .catch((err) => {
        console.log("ERROR: " + err);
      });
  }

  /**
   * Cria um Empréstimo somente se houver
   * testes
   */
  async createTesteEmprestimo(req, res) {
    const {
      id_teste
    } = req.params;

    const {
      codigo,
      status,
      data_devolucao,
      data,
      retorno_previsto
    } = req.body;

    const teste = await Teste.findByPk(id_teste);

    if (!teste) {
      return res.status(400).json({
        error: "Teste not found",
      });
    }

    const [emprestimo] = await Emprestimo.findOrCreate({
      where: {
        codigo,
        status,
        data_devolucao,
        data,
        retorno_previsto,
      },
    });

    await teste.addEmprestimo(emprestimo);

    const emprestimos = await Emprestimo.findOne({
      where: {
        codigo: codigo,
      },
      attributes: [
        "id",
        "codigo",
        "status",
        "data_devolucao",
        "data",
        "retorno_previsto",
      ],
      include: [{
        model: Teste,
        as: "testes",
        attributes: ["id", "nome", "codigo", "status"],
      }, ],
    });

    return res.json(emprestimos);
  }

  /* adicionar relacionamento */
  async addTesteEmprestimo(req, res) {
    const {
      id_teste,
      id_emprestimo
    } = req.params;

    const teste = await Teste.findByPk(id_teste);
    const emprestimo = await Emprestimo.findByPk(id_emprestimo);

    if (!teste) {
      return res.status(400).json({
        error: "Teste not found",
      });
    }

    if (!emprestimo) {
      return res.status(400).json({
        error: "Empréstimo not found",
      });
    }

    await teste.addEmprestimo(emprestimo);
    return res.json(emprestimo);
  }

  /* apagar relacionamento */
  async deleteTesteEmprestimo(req, res) {
    const {
      id_teste,
      id_emprestimo
    } = req.params;

    const teste = await Teste.findByPk(id_teste);
    const emprestimo = await Emprestimo.findByPk(id_emprestimo);

    if (!teste) {
      return res.status(400).json({
        error: "Teste not found",
      });
    }

    if (!emprestimo) {
      return res.status(400).json({
        error: "Empréstimo not found",
      });
    }

    await teste.removeEmprestimo(emprestimo);
    return res.json(emprestimo);
  }
}

export default new EmprestimoController();