import * as Yup from "yup";
import Aluno from "../models/Aluno";
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

class AlunoController{
    async store(req, res) {
    await Aluno.create(
        {
          matricula: req.body.aluno.matricula,
          nome: req.body.aluno.nome,
          telefone: req.body.aluno.telefone,
          email: req.body.aluno.email
        }
      )
        .then(aluno => {
          return res.status(201).json({
            aluno: {
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
    }
  
    async index(req, res) {
      await Aluno.findAll({
        attributes: ["id", "matricula", "nome", "telefone", "email"],
        order: [["id", "ASC"]]
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
        where: { id: req.params.id }
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
  
    async indexByQuery(req, res){
       
      let query = req.params.query.split('+');
      let aluno=[];
      for(let i=0;i<query.length;i++){
        aluno.push(await Aluno.findAll({
          where :{matricula: {[Op.iLike]: "%"+query[i]+"%"}},
          attributes: ['matricula', 'nome', 'telefone', 'email'],
        }))}
  
        if(aluno){
          return res.status(200).json(aluno);
        }else{
          return res.status(200).json({error:"Nenhum Aluno encontrado"});
        }
    }
  
    async indexByNome(req, res) {

      let query = req.params.query.split('+');
      let aluno=[];
      for(let i=0;i<query.length;i++){
        aluno.push(await Aluno.findAll({
          where :{nome: {[Op.iLike]: "%"+query[i]+"%"}},
          attributes: ['matricula', 'nome', 'telefone', 'email'],
        }))}
  
        if(aluno){
          return res.status(200).json(aluno);
        }else{
          return res.status(200).json({error:"Nenhum Aluno encontrado"});
        }
      }

      async delete(req, res) {
        const aluno = await Aluno.findOne({
          where: { id: req.params.id },
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


