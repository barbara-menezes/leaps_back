import * as Yup from "yup";
import Disciplina from "../models/Disciplina";
import Aluno from "../models/Aluno";
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

class DisciplinaController {
  async store(req, res) {
    // const schemaDisciplina = Yup.object().shape({
    //     nome_disciplina: Yup.string().required(),
    //     turno: Yup.string().required(),
    //     periodo: Yup.number().required(),
    //     codigo: Yup.number().required()
    // });

    // if (!(await schemaDisciplina.isValid(req.body))) {
    //     return res.status(200).json({ error: "Campo disciplina não esta de acordo" });
    // }

    const {
      id_aluno
    } = req.params;

    await Disciplina.create({
        nome_disciplina: req.body.disciplina.nome_disciplina,
        turno: req.body.disciplina.turno,
        periodo: req.body.disciplina.periodo,
        codigo: req.body.disciplina.codigo
      }, {
        include: [{
          model: Aluno,
          as: 'alunos',
        }]
      })
      .then(disciplina => {
        return res.status(201).json({
          disciplina: {
            id: disciplina.id,
            nome_disciplina: disciplina.nome_disciplina,
            turno: disciplina.turno,
            periodo: disciplina.periodo,
            codigo: disciplina.codigo
          }
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async viewAllDisciplina(req, res) {
    const {
      id_aluno
    } = req.params;

    const aluno = await Aluno.findByPk(id_aluno, {
      include: {
        association: 'disciplinas'
      }
    });

    return res.json(aluno.disciplinas);

  }

  async storeOnlyAluno(req, res) {
    const {
      id_aluno
    } = req.params;
    // const {
    //   nome_disciplina,
    //   turno,
    //   periodo,
    //   codigo
    // } = req.body;

    const aluno = await Aluno.findByPk(id_aluno);

    if (!aluno) {
      return res.status(400).json({
        error: 'Aluno não encontrado '
      });
    }

    const disciplina = await Disciplina.create({
        nome_disciplina: req.body.disciplina.nome_disciplina,
        turno: req.body.disciplina.turno,
        periodo: req.body.disciplina.periodo,
        codigo: req.body.disciplina.codigo,
      })
      .then(disciplina => {
        return res.status(201).json({
          disciplina: {
            id: disciplina.id,
            nome_disciplina: disciplina.nome_disciplina,
            turno: disciplina.turno,
            periodo: disciplina.periodo,
            codigo: disciplina.codigo
          }
        });
      });

    // adicionando uma disciplina no usuário pelo relacionamento
    await aluno.addDisciplina(disciplina);

    return res.json(disciplina);

  } //end storeOnlyAluno

  // nome_disciplina: Sequelize.STRING,
  // turno: Sequelize.STRING,
  // periodo: Sequelize.STRING,
  // codigo: Sequelize.STRING,
  // async store(req, res) {

  // const {
  //   nome_disciplina
  // } = req.body.disciplina.nome_disciplina;
  // const {
  //   turno
  // } = req.body.disciplina.turno;
  // const {
  //   periodo
  // } = req.body.disciplina.periodo;
  // const {
  //   codigo
  // } = req.body.disciplina.codigo;

  // const {
  //   id_aluno
  // } = req.params;

  // const {
  //   nome_disciplina,
  //   turno,
  //   periodo,
  //   codigo
  // } = req.body;

  // const aluno = await Aluno.findByPk(id_aluno);

  // if (!aluno) {
  //   return res.status(400).json({
  //     error: 'Aluno não encontrado '
  //   });
  // }

  // const [disciplina] = await Disciplina.findOrCreate({
  //   where: {
  //     nome_disciplina
  //   }
  // });

  // const disc = await Disciplina.create({
  //   nome_disciplina,
  //   turno,
  //   periodo,
  //   codigo,
  // }, {
  //   include: [{
  //     model: Aluno,
  //     as: 'alunos'
  //   }]
  // });

  // add na tabela do relacionamento N:N
  // await aluno.addDisciplina(disc); //model

  // return res.json(disc);

  // }

  async index(req, res) {
    await Disciplina.findAll({
        attributes: ["id", "nome_disciplina", "turno", "periodo", "codigo"],
        order: [
          ["id", "ASC"]
        ]
      })
      .then(disciplina => {
        return res.status(201).json({
          disciplina
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }
  async showById(req, res) {
    await Disciplina.findOne({
        where: {
          id: req.params.id
        }
      })
      .then(disciplina => {
        return res.status(201).json({
          disciplina
        });
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async indexById(req, res) {
    const {
      id_aluno
    } = req.params;

    const aluno = await Aluno.findByPk(id_aluno, {
      include: {
        model: Disciplina,
        as: 'disciplinas',
      }
    })

    return res.json(aluno.disciplinas)
  }

  async update(req, res) {

    Disciplina.findOne(filtro)
      .then(async disciplina => {
        if (disciplina) {
          await disciplina.update(
            req.body.disciplina
          );
        } else {
          return res.status(200).json({
            error: "Usuario não encontrado."
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async indexByQuery(req, res) {

    let query = req.params.query.split('+');
    let disciplina = [];
    for (let i = 0; i < query.length; i++) {
      disciplina.push(await Disciplina.findAll({
        where: {
          codigo: {
            [Op.iLike]: "%" + query[i] + "%"
          }
        },
        attributes: ['nome_disciplina', 'turno', 'periodo', 'codigo'],
      }))
    }

    if (disciplina) {
      return res.status(200).json(disciplina);
    } else {
      return res.status(200).json({
        error: "Nenhuma Disciplina encontrada"
      });
    }
  }

  async indexByNome(req, res) {

    let query = req.params.query.split('+');
    let disciplina = [];
    for (let i = 0; i < query.length; i++) {
      disciplina.push(await Disciplina.findAll({
        where: {
          nome_disciplina: {
            [Op.iLike]: "%" + query[i] + "%"
          }
        },
        attributes: ['nome_disciplina', 'turno', 'periodo', 'codigo'],
      }))
    }

    if (disciplina) {
      return res.status(200).json(disciplina);
    } else {
      return res.status(200).json({
        error: "Nenhuma Disciplina encontrada"
      });
    }
  }

  async delete(req, res) {

    const {
      id_aluno
    } = req.params;

    const aluno = await Aluno.findByPk(id_aluno);

    if (!aluno) {
      return res.status(400).json({
        error: 'Aluno não encontrado '
      });
    }

    const disciplina = await Disciplina.findOne({
      where: {
        id: req.params.id
      },
    });

    // deleta o relacionamento de disciplina com aluno
    await aluno.removeDisciplina(disciplina);

    await disciplina.destroy().then(() => {
        return res.status(201).json({
          message: "Disciplina deletada com sucesso!"
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }
}

export default new DisciplinaController();