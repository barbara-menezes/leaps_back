import * as Yup from "yup";
import Aluno from "../models/Aluno";
import Sequelize from 'sequelize';
import Disciplina from "../models/Disciplina";
const Op = Sequelize.Op;

class AlunoController {

  async student(req, res) {
    try {
      const student = await Aluno.create(req.body);
      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json({
        err: 'XAMBRO'
      });
    }
  }

  async showAllStudents(req, res) {
    try {
      const student = await Aluno.findAll({
        include: [{
          model: Disciplina,
          as: 'disciplinas',
          through: {
            attributes: []
          },
        }]
      });
      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json({
        err: 'XAMBRO'
      });
    }
  }

  async StudentAndDict(req, res) {
    try {
      const {
        disciplinas,
        ...data
      } = req.body;
      const student = await Aluno.create(data);

      if (disciplinas && disciplinas.length > 0) {
        //add student
        // disc.setDisciplina(student);
        student.addAlunos(disciplinas);
      }

      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json({
        err: 'XAMBRO'
      });
    }
  }

  async store(req, res) {
    await Aluno.create({
        matricula: req.body.aluno.matricula,
        nome: req.body.aluno.nome,
        telefone: req.body.aluno.telefone,
        email: req.body.aluno.email,
      }, {
        include: [{
          model: Disciplina,
          as: 'disciplinas',
        }]
      })
      .then(aluno => {
        return res.status(201).json({
          aluno: {
            id: aluno.id,
            matricula: aluno.matricula,
            nome: aluno.nome,
            telefone: aluno.telefone,
            email: aluno.email
          }
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });

    // const {
    //   id_disciplina
    // } = req.params;

    // const disciplina = await Disciplina.findByPk(id_disciplina);

    // if (!disciplina) {
    //   return res.status(400).json({
    //     error: 'Disciplina não encontrada'
    //   });
    // }

    // await disciplina.addAluno(aluno); //model
    // return res.json(aluno);
  }

  async index(req, res) {
    await Aluno.findAll({
        include: {
          model: Disciplina,
          as: "disciplinas",
          through: {
            attributes: []
          }
        },
        attributes: ["id", "matricula", "nome", "telefone", "email"],
        order: [
          ["id", "ASC"]
        ]
      })
      .then(aluno => {
        return res.status(201).json({
          aluno
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async showById(req, res) {
    await Aluno.findOne({
        where: {
          id: req.params.id
        }
      })
      .then(aluno => {
        return res.status(201).json({
          aluno
        });
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async update(req, res) {

    Aluno.findOne(filtro)
      .then(async aluno => {
        if (aluno) {
          await aluno.update(
            req.body.aluno
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
    let aluno = [];
    for (let i = 0; i < query.length; i++) {
      aluno.push(await Aluno.findAll({
        where: {
          matricula: {
            [Op.iLike]: "%" + query[i] + "%"
          }
        },
        attributes: ['matricula', 'nome', 'telefone', 'email'],
      }))
    }

    if (aluno) {
      return res.status(200).json(aluno);
    } else {
      return res.status(200).json({
        error: "Nenhum Aluno encontrado"
      });
    }
  }

  async indexByNome(req, res) {

    let query = req.params.query.split('+');
    let aluno = [];
    for (let i = 0; i < query.length; i++) {
      aluno.push(await Aluno.findAll({
        where: {
          nome: {
            [Op.iLike]: "%" + query[i] + "%"
          }
        },
        attributes: ['matricula', 'nome', 'telefone', 'email'],
      }))
    }

    if (aluno) {
      return res.status(200).json(aluno);
    } else {
      return res.status(200).json({
        error: "Nenhum Aluno encontrado"
      });
    }
  }

  async delete(req, res) {
    const aluno = await Aluno.findOne({
      where: {
        id: req.params.id
      },
    });
    await aluno.destroy().then(() => {
        return res.status(201).json({
          message: "Aluno deletado com sucesso!"
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }
}

export default new AlunoController();