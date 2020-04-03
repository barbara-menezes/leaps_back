import * as Yup from "yup";
import Disciplina from "../models/Disciplina";
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

class DisciplinaController {
    async store(req, res) {

      const disciplinaExist = await Disciplina.findOne({
        where: { codigo: req.body.disciplina.codigo }
      });

      if (disciplinaExist) {
        return res.status(200).json({ error: "Disciplina já cadastrada." });
      } 

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
    async showById(req, res) {
      await Disciplina.findOne({
        where: { id: req.params.id }
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
  
    async indexByQuery(req, res){
       
      let query = req.params.query.split('+');
      let disciplina=[];
      for(let i=0;i<query.length;i++){
        disciplina.push(await Disciplina.findAll({
          where :{codigo: {[Op.iLike]: "%"+query[i]+"%"}},
          attributes: ['nome_disciplina', 'turno', 'periodo', 'codigo'],
        }))}
  
        if(disciplina){
          return res.status(200).json(disciplina);
        }else{
          return res.status(200).json({error:"Nenhuma Disciplina encontrada"});
        }
    }
  
    async indexByNome(req, res) {

      let query = req.params.query.split('+');
      let disciplina=[];
      for(let i=0;i<query.length;i++){
        disciplina.push(await Disciplina.findAll({
          where :{nome_disciplina: {[Op.iLike]: "%"+query[i]+"%"}},
          attributes: ['nome_disciplina', 'turno', 'periodo', 'codigo'],
        }))}
  
        if(disciplina){
          return res.status(200).json(disciplina);
        }else{
          return res.status(200).json({error:"Nenhuma Disciplina encontrada"});
        }
      }

      async delete(req, res) {
        const disciplina = await Disciplina.findOne({
          where: { id: req.params.id },
        });
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


