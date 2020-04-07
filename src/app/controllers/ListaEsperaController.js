import * as Yup from "yup";
import Lista_Espera from "../models/Lista_Espera";
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

class ListaEsperaController {
    async store(req, res) {

      const codigoExist = await Lista_Espera.findOne({
        where: { codigo: req.body.lista_espera.codigo }
      });

      if (codigoExist) {
        return res.status(200).json({ error: "Codigo já cadastrada." });
      } 

    await Lista_Espera.create(
            {
                codigo: req.body.lista_espera.codigo,
                status: req.body.lista_espera.status,
            }
        )
        .then(lista_espera => {
            return res.status(201).json({
            lista_espera: {
                  id: lista_espera.id,
                  codigo: lista_espera.codigo,
                  status: lista_espera.status,
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

      const esperas = await Lista_Espera.findAll({
        attributes: ["id", "codigo", "status"],
        order: [["id", "ASC"]]
      })
      const espera = esperas.slice(startIndex, endIndex)
      try{
        return res.status(201).json({
              espera,  
              currentPage: page,
              previousPage: startIndex > 0 ? page - 1 : "Nao existe pagina anterior",
              nextPage: endIndex < esperas.length ? page + 1 : "Nao existe pagina posterior",
              limit: limit
          });
      }
      catch(err){
        console.log("ERRO: " + err);
      };
    }

    async showById(req, res) {
      await Lista_Espera.findOne({
        where: { id: req.params.id }
      })
        .then(lista_espera => {
          return res.status(201).json({
            lista_espera
          });
        })
        .catch(err => {
          return res.status(500).json({
            error: "Erro no servidor."
          });
        });
    }
  
    async update(req, res) {

      const idExist = await Lista_Espera.findOne({ where: { id: req.params.id } });

      if (!idExist) {
        return res
          .status(200)
          .json({ error: "Id da Espera informada nao existe" });
      }

      Lista_Espera.findOne({
        where: { id: req.params.id }
       }).
        then(async lista_espera => {
          if (lista_espera) {
              await lista_espera.update(
              req.body.lista_espera
            );
            return res.status(201).json({
              lista_espera
            });
          } else {
            return res.status(200).json({
              error: "Espera não encontrado."
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
      let lista_espera=[];
      for(let i=0;i<query.length;i++){
        lista_espera.push(await Lista_Espera.findAll({
          where :{codigo: {[Op.iLike]: "%"+query[i]+"%"}},
          attributes: ['id', 'codigo', 'status'],
        }))}
  
        if(lista_espera){
          return res.status(200).json(lista_espera);
        }else{
          return res.status(200).json({error:"Nenhuma espera encontrada"});
        }
    }
  
    async indexByStatus(req, res) {

      let query = req.params.query.split('+');
      let lista_espera=[];
      for(let i=0;i<query.length;i++){
        lista_espera.push(await Lista_Espera.findAll({
          where :{status: {[Op.iLike]: "%"+query[i]+"%"}},
          attributes: ['id', 'codigo', 'status'],
        }))}
  
        if(lista_espera){
          return res.status(200).json(lista_espera);
        }else{
          return res.status(200).json({error:"Nenhuma espera encontrada"});
        }
      }

      async delete(req, res) {
        const lista_espera = await Lista_Espera.findOne({
          where: { id: req.params.id },
        });
        await lista_espera.destroy().then(() => {
            return res.status(201).json({
              message: "Espera deletada com sucesso!"
            });
          })
          .catch(err => {
            console.log("ERRO: " + err);
          });
      }
  }

export default new ListaEsperaController();


