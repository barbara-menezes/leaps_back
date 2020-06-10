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
    try {
      const {
        alunos,
        testes,
        ...data
      } = req.body;

      const emprestimo = await Emprestimo.create(data);

      if (alunos && alunos.length > 0 &&
        testes && testes.length > 0) {
        emprestimo.setAlunos(alunos);
        emprestimo.setTestes(testes);
      }
      Teste.findOne({
        where: {
          id: testes,
        },
      })
      .then(async (teste) => {
        if (teste) {
          await teste.update({status:"EMPRESTADO"});
          return res.status(201).json({
            teste,
          });
        }
      })

      return res.status(200).json(emprestimo);
    } catch (err) {
      return res.status(500).json({
        err,
      });
    }
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

  async devolucao(req, res) {
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
        include: [{
          model: Teste,
          as: "testes",
          attributes: ["id", "nome", "codigo", "status"],
        }],
      })
      .then(async (emprestimo) => {
        if (emprestimo) {
          await emprestimo.update({
            data_devolucao: req.body.data_devolucao, 
            status: "DEVOLVIDO",
          })
          Teste.findOne({
            where: {
              id: emprestimo.testes[0].id,
            },
          })
          .then(async (teste) => {
            if (teste) {
              await teste.update({status:"DISPONÍVEL"});
              return res.status(201).json({
                teste,
              });
            }
          })

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