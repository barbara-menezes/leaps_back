import * as Yup from "yup";
import Disciplina from "../models/Disciplina";
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

    await Disciplina.create(
        {
        nome_disciplina: req.body.disciplina.nome_disciplina,
        turno: req.body.disciplina.turno,
        periodo: req.body.disciplina.periodo,
        codigo: req.body.disciplina.codigo
        }
        )
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
  
    async index(req, res) {
      await Disciplina.findAll({
        attributes: ["id", "nome_disciplina", "turno", "periodo", "codigo"],
        order: [["id", "ASC"]]
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
}

export default new DisciplinaController();
