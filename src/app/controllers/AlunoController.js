import * as Yup from "yup";
import Aluno from "../models/Aluno";
import Sequelize from "sequelize";
import Disciplina from "../models/Disciplina";
import Emprestimo from "../models/Emprestimo";
const Op = Sequelize.Op;

class AlunoController {
  async store(req, res) {
    try {
      const {
        disciplinas,
        ...data
      } = req.body;

      const aluno = await Aluno.create(data);

      if (disciplinas && disciplinas.length > 0) {
        aluno.setDisciplinas(disciplinas);
      }

      return res.status(200).json(aluno);
    } catch (err) {
      return res.status(500).json({
        err
      });
    }
  }

  async store_2(req, res) {
    await Aluno.create({
        matricula: req.body.aluno.matricula,
        nome: req.body.aluno.nome,
        telefone: req.body.aluno.telefone,
        email: req.body.aluno.email,
      }, {
        include: [{
          model: Disciplina,
          as: "disciplinas",
          through: {
            attributes: [],
          },
        }, ],
      })
      .then((aluno) => {
        return res.status(201).json({
          aluno: {
            id: aluno.id,
            matricula: aluno.matricula,
            nome: aluno.nome,
            telefone: aluno.telefone,
            email: aluno.email,
          },
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    await Aluno.findAll({
        include: [{
            model: Disciplina,
            as: "disciplinas",
            through: {
              attributes: [],
            },
          },
          {
            model: Emprestimo,
            as: "emprestimos",
          },
        ],
        attributes: ["id", "matricula", "nome", "telefone", "email"],
        order: [
          ["id", "ASC"]
        ],
      })
      .then((aluno) => {
        return res.status(201).json({
          aluno,
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });
  }

  async showById(req, res) {
    await Aluno.findOne({
        where: {
          id: req.params.id,
        },
        include: [{
          model: Disciplina,
          as: "disciplinas",
          through: {
            attributes: [],
          },
        },
      ],
      })
      .then((aluno) => {
        return res.status(201).json({
          aluno,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: "Erro no servidor.",
        });
      });
  }

  async update(req, res) {
    const idExist = await Aluno.findOne({
      where: {
        matricula: req.params.matricula,
      },
      include: [{
        model: Disciplina,
        as: "disciplinas",
        through: {
          attributes: [],
        },
      },
    ],
    });

    if (!idExist) {
      return res.status(200).json({
        error: "Matrícula do Aluno informado nao existe",
      });
    }

    Aluno.findOne({
        where: {
          matricula: req.params.matricula,
        },
      })
      .then(async (aluno) => {
        if (aluno) {
          const {
            disciplinas,
            ...data
          } = req.body;

          await aluno.update(data);
          if (disciplinas && disciplinas.length > 0) {
            aluno.setDisciplinas(disciplinas);
          }
          return res.status(201).json({
            aluno,
          });
        } else {
          return res.status(200).json({
            error: "Aluno não encontrado.",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          error: "Erro no servidor.",
        });
      });
  }

  async indexByQuery(req, res) {
    let query = req.params.query.split("+");
    let aluno = [];
    for (let i = 0; i < query.length; i++) {
      aluno.push(
        await Aluno.findAll({
          where: {
            matricula: {
              [Op.iLike]: "%" + query[i] + "%",
            },
          },include: [{
            model: Disciplina,
            as: "disciplinas",
            through: {
              attributes: [],
            },
          },
        ],
          attributes: ["matricula", "nome", "telefone", "email"],
        })
      );
    }

    if (aluno) {
      return res.status(200).json(aluno);
    } else {
      return res.status(200).json({
        error: "Nenhum Aluno encontrado",
      });
    }
  }

  async indexByNome(req, res) {
    let query = req.params.query.split("+");
    let aluno = [];
    for (let i = 0; i < query.length; i++) {
      aluno.push(
        await Aluno.findAll({
          where: {
            nome: {
              [Op.iLike]: "%" + query[i] + "%",
            },
          },
          include: [{
            model: Disciplina,
            as: "disciplinas",
            through: {
              attributes: [],
            },
          },
        ],
          attributes: ["matricula", "nome", "telefone", "email"],
        })
      );
    }

    if (aluno) {
      return res.status(200).json(aluno);
    } else {
      return res.status(200).json({
        error: "Nenhum Aluno encontrado",
      });
    }
  }

  async delete(req, res) {
    const aluno = await Aluno.findOne({
      where: {
        id: req.params.id,
      },
    });
    await aluno
      .destroy()
      .then(() => {
        return res.status(201).json({
          message: "Aluno deletado com sucesso!",
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });
  }

  /**
   * Cria um Empréstimo somente se houver
   * aluno
   */
  async createAlunoEmprestimo(req, res) {
    const {
      id_aluno
    } = req.params;

    const {
      codigo,
      status,
      data_devolucao,
      data,
      retorno_previsto
    } = req.body;

    const aluno = await Aluno.findByPk(id_aluno);

    if (!aluno) {
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

    await emprestimo.addAluno(aluno);
    return res.json(aluno);
  }

  /*
   * add relationship of manyToMany
   */
  async addDisciplinaAluno(req, res) {
    const {
      id_disciplina
    } = req.params;

    const {
      matricula,
      nome,
      telefone,
      email
    } = req.body;

    const disciplina = await Disciplina.findByPk(id_disciplina);

    if (!disciplina) {
      return res.status(400).json({
        error: "Disciplina not found",
      });
    }

    const [aluno] = await Aluno.findOrCreate({
      where: {
        matricula,
        nome,
        telefone,
        email,
      },
    });

    await disciplina.addAlunos(aluno);
    return res.json(aluno);
  }

  /**
   * Associa aluno a empréstimo
   * se já estiverem sido criado
   * posteriormente
   */
  async addAlunoEmprestimo(req, res) {
    const {
      id_emprestimo,
      id_aluno
    } = req.params;

    const emprestimo = await Emprestimo.findByPk(id_emprestimo);
    const aluno = await Aluno.findByPk(id_aluno);

    if (!emprestimo) {
      return res.status(400).json({
        error: "Empréstimo not found",
      });
    }

    if (!aluno) {
      return res.status(400).json({
        error: "Aluno not found",
      });
    }

    await emprestimo.addAluno(aluno);
    return res.json(aluno);
  }
}

export default new AlunoController();