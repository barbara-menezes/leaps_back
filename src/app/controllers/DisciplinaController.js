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

      const page = req.query.page !== undefined ? parseInt(req.query.page) : 1;
      const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const disciplinas = await Disciplina.findAll({
        attributes: ["id", "nome_disciplina", "turno", "periodo", "codigo"],
        order: [["id", "ASC"]]
      })
      const disciplina = disciplinas.slice(startIndex, endIndex)
      try{
        return res.status(201).json({
              disciplina,  
              currentPage: page,
              previousPage: startIndex > 0 ? page - 1 : "Nao existe pagina anterior",
              nextPage: endIndex < disciplinas.length ? page + 1 : "Nao existe pagina posterior",
              limit: limit
          });
      }
      catch(err){
        console.log("ERRO: " + err);
      };
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

      const idExist = await Disciplina.findOne({ where: { id: req.params.id } });

      if (!idExist) {
        return res
          .status(200)
          .json({ error: "Id da Disciplina informada nao existe" });
      }

      Disciplina.findOne({
        where: { id: req.params.id }
       }).
        then(async disciplina => {
          if (disciplina) {
              await disciplina.update(
              req.body.disciplina
            );
            return res.status(201).json({
              disciplina
            });
          } else {
            return res.status(200).json({
              error: "Disciplina não encontrado."
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
          return res.status(200).json({error:"Nenhuma disciplina encontrada"});
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
          return res.status(200).json({error:"Nenhuma disciplina encontrada"});
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


