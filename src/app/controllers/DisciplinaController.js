import * as Yup from "yup";
import Disciplina from "../models/Disciplina";
import Sequelize from "sequelize";
import Aluno from "../models/Aluno";
import Teste from "../models/Teste";
// import Mail from '../lib/Mail';
const Op = Sequelize.Op;

class DisciplinaController {
  async store(req, res) {
    try {
      const {
        testes,
        ...data
      } = req.body;

      const disciplina = await Disciplina.create(data);

      if (testes && testes.length > 0) {
        disciplina.setTestes(testes);
      }

      return res.status(200).json(disciplina);
    } catch (err) {
      return res.status(500).json({
        err
      });
    }
  }

    // async store_2(req, res) {
  //   const disciplinaExist = await Disciplina.findOne({
  //     where: {
  //       codigo: req.body.disciplina.codigo,
  //     },
  //   });

  //   if (disciplinaExist) {
  //     return res.status(200).json({
  //       error: "Disciplina já cadastrada.",
  //     });
  //   }

  //   await Disciplina.create({
  //       nome_disciplina: req.body.disciplina.nome_disciplina,
  //       turno: req.body.disciplina.turno,
  //       periodo: req.body.disciplina.periodo,
  //       codigo: req.body.disciplina.codigo,
  //     })
  //     .then((disciplina) => {
  //       return res.status(201).json({
  //         disciplina: {
  //           id: disciplina.id,
  //           nome_disciplina: disciplina.nome_disciplina,
  //           turno: disciplina.turno,
  //           periodo: disciplina.periodo,
  //           codigo: disciplina.codigo,
  //         },
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("ERRO: " + err);
  //     });
  // }

  async index(req, res) {
    const {
      page = 1, //default
    } = req.query;

    await Disciplina.findAll({
        attributes: ["id", "nome_disciplina", "turno", "periodo", "codigo"],
        order: [
          ["id", "ASC"]
        ],
        limit: 20, //paginação
        offset: (page - 1) * 20,
        include: [{
            model: Aluno,
            as: 'alunos',
            attributes: ['nome', 'email'],
          },
          {
            model: Teste,
            as: 'testes',
            attributes: ['id', 'nome', 'codigo', 'status'],
          }
        ],
      })
      .then((disciplina) => {
        return res.status(201).json({
          disciplina,
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });
  }
  
  async showById(req, res) {
    await Disciplina.findOne({
        where: {
          id: req.params.id,
        },
        include: [
        {
          model: Teste,
          as: 'testes',
          attributes: ['id', 'nome', 'codigo', 'status'],
        }
      ],
      })
      .then((disciplina) => {
        return res.status(201).json({
          disciplina,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: "Erro no servidor.",
        });
      });
  }

  async update(req, res) {
    const idExist = await Disciplina.findOne({
      where: {
        id: req.params.id,
      },
      include: [{
        model: Teste,
        as: "testes",
        through: {
          attributes: [],
        },
      },
    ],
    });

    if (!idExist) {
      return res.status(200).json({
        error: "Id da Disciplina informada nao existe",
      });
    }

    Disciplina.findOne({
        where: {
          id: req.params.id,
        },
      })
      .then(async (disciplina) => {
        if (disciplina) {
          const {
            testes,
            ...data
          } = req.body;

          await disciplina.update(data);
          if (testes && testes.length > 0) {
            disciplina.setTestes(testes);
          }
          return res.status(201).json({
            disciplina,
          });
        } else {
          return res.status(200).json({
            error: "Disciplina não encontrado.",
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
    let disciplina = [];
    for (let i = 0; i < query.length; i++) {
      disciplina.push(
        await Disciplina.findAll({
          where: {
            codigo: {
              [Op.iLike]: "%" + query[i] + "%",
            },
          },
          attributes: ["nome_disciplina", "turno", "periodo", "codigo"],
        })
      );
    }

    if (disciplina) {
      return res.status(200).json(disciplina);
    } else {
      return res.status(200).json({
        error: "Nenhuma disciplina encontrada",
      });
    }
  }

  async indexByNome(req, res) {
    let query = req.params.query.split("+");
    let disciplina = [];
    for (let i = 0; i < query.length; i++) {
      disciplina.push(
        await Disciplina.findAll({
          where: {
            nome_disciplina: {
              [Op.iLike]: "%" + query[i] + "%",
            },
          },
          attributes: ["nome_disciplina", "turno", "periodo", "codigo"],
        })
      );
    }

    if (disciplina) {
      return res.status(200).json(disciplina);
    } else {
      return res.status(200).json({
        error: "Nenhuma disciplina encontrada",
      });
    }
  }

  async delete(req, res) {
    const disciplina = await Disciplina.findOne({
      where: {
        id: req.params.id,
      },
    });
    const disciplinasAtualizada = await Disciplina.findAll({
      attributes: ["id", "nome_disciplina", "turno", "periodo", "codigo"],
      order: [
        ["id", "ASC"]
      ],
    });

    await disciplina
      .destroy()
      .then(() => {
        return res.status(201).json({
          message: "Disciplina deletada com sucesso!",
          disciplinas: disciplinasAtualizada,
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });
  }

  async deleteAndListAll(req, res) {
    const disciplina = await Disciplina.findOne({
      where: {
        id: req.params.id,
      },
    });
    disciplina.destroy();
    const deleted = await Disciplina.findAll();
    return res.json(deleted);
  }
  /*
   * add relationship of manyToMany
   */
  async storege_relationship(req, res) {
    const {
      id_aluno
    } = req.params;

    const {
      nome_disciplina,
      turno,
      periodo,
      codigo
    } = req.body;

    const aluno = await Aluno.findByPk(id_aluno);

    if (!aluno) {
      return res.status(400).json({
        error: "Aluno not found",
      });
    }

    const [disciplina] = await Disciplina.findOrCreate({
      where: {
        nome_disciplina,
        turno,
        periodo,
        codigo,
      },
    });

    await aluno.addDisciplina(disciplina);
    return res.json(disciplina);
  }

  /* adicionar relacionamento */
  async addAlunoDisciplina(req, res) {
    const {
      id_aluno,
      id_disciplina
    } = req.params;

    const aluno = await Aluno.findByPk(id_aluno);
    const disciplina = await Disciplina.findByPk(id_disciplina);

    if (!aluno) {
      return res.status(400).json({
        error: "Aluno not found",
      });
    }

    if (!disciplina) {
      return res.status(400).json({
        error: "Disciplina not found",
      });
    }

    await aluno.addDisciplina(disciplina);
    return res.json('Relationship success');
  }

  /* apagar relacionamento */
  async deleteAlunoDisciplina(req, res) {
    const {
      id_aluno,
      id_disciplina
    } = req.params;

    const aluno = await Aluno.findByPk(id_aluno);
    const disciplina = await Disciplina.findByPk(id_disciplina);

    if (!aluno) {
      return res.status(400).json({
        error: "Aluno not found",
      });
    }

    if (!disciplina) {
      return res.status(400).json({
        error: "Disciplina not found",
      });
    }

    await aluno.removeDisciplina(disciplina);
    return res.json('Relationship deleted');
  }

  /**
   * Associa um teste e uma
   * disciplina anteriormente
   * já criadas
   */
  async addTesteDisciplina(req, res) {
    const {
      id_teste,
      id_disciplina,
    } = req.params;

    const teste = await Teste.findByPk(id_teste);
    const disciplina = await Disciplina.findByPk(id_disciplina);


    if (!disciplina) {
      return res.status(400).json({
        error: "Disciplina not found",
      });
    }

    if (!teste) {
      return res.status(400).json({
        error: "Disciplina not found",
      });
    }

    await teste.addDisciplina(disciplina);
    return res.json(disciplina);
  }

  /**
   * Cria um teste somente se
   * já tiver uma disciplina
   * disponível
   */
  async createTesteDisciplina(req, res) {
    const {
      id_disciplina
    } = req.params;

    const {
      nome,
      codigo,
      status,
    } = req.body;

    const disciplina = await Disciplina.findByPk(id_disciplina);

    if (!disciplina) {
      return res.status(400).json({
        error: "Disciplina not found",
      });
    }

    const [teste] = await Teste.findOrCreate({
      where: {
        nome,
        codigo,
        status,
      },
    });

    await teste.addDisciplina(disciplina);
    return res.json(teste);
  }

}

export default new DisciplinaController();