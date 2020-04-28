import * as Yup from "yup";
import Disciplina from "../models/Disciplina";
import Sequelize from "sequelize";
const Op = Sequelize.Op;
// import Mail from '../lib/Mail';
import Aluno from "../models/Aluno";

class DisciplinaController {
  async store(req, res) {
    const disciplinaExist = await Disciplina.findOne({
      where: {
        codigo: req.body.disciplina.codigo,
      },
    });

    if (disciplinaExist) {
      return res.status(200).json({
        error: "Disciplina já cadastrada.",
      });
    }

    await Disciplina.create({
        nome_disciplina: req.body.disciplina.nome_disciplina,
        turno: req.body.disciplina.turno,
        periodo: req.body.disciplina.periodo,
        codigo: req.body.disciplina.codigo,
      })
      .then((disciplina) => {
        return res.status(201).json({
          disciplina: {
            id: disciplina.id,
            nome_disciplina: disciplina.nome_disciplina,
            turno: disciplina.turno,
            periodo: disciplina.periodo,
            codigo: disciplina.codigo,
          },
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });
  }

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
      })
      .then((disciplina) => {
        return res.status(201).json({
          disciplina,
        });
      })
      .catch((err) => {
        console.log("ERRO: " + err);
      });

    // envio de e-mail teste
    // await Mail.sendMail({
    //   to: `${disciplina.alunos.nome} <${disciplina.alunos.email}>`,
    //   subject: 'Disciplina criada com sucesso.',
    //   text: 'Você tem uma nova disciplina.'
    // });
  }
  async showById(req, res) {
    await Disciplina.findOne({
        where: {
          id: req.params.id,
        },
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
          await disciplina.update(req.body.disciplina);
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

}

export default new DisciplinaController();