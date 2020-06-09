import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import Usuario_Coordenador from "../models/Usuario_Coordenador";
import authConfig from "../../config/auth";
import bcrypt from "bcryptjs";
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import Sequelize from 'sequelize';
const routes = new Router();
const Op = Sequelize.Op;

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
  return token;
}

function cryptPass(senha) {
  if (senha) {
    return bcrypt.hash(senha, 10);
  }
}

class UsuarioCoordenadorController {
  async store(req, res) {
    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email }
    });

    const usuarioExists = await Usuario.findOne({
      where: { usuario: req.body.usuario.usuario }
    });

    const matriculaExists = await Usuario.findOne({
      where: { matricula: req.body.usuario.matricula }
    });

    const coodernadorExists = await Usuario_Coordenador.findOne({
      where: { cod_pessoa: req.body.usuario_coordenador.cod_pessoa }
    });

    req.body.usuario.senha = await cryptPass(req.body.usuario.senha);

    if (usuarioExists) {
      return res.status(200).json({ error: "Usuario ja existe." });
    } else if (emailExists) {
      return res.status(200).json({ error: "Email ja esta em uso." });
    }else if (matriculaExists) {
      return res.status(200).json({ error: "Matricula ja esta em uso." });
    }else if (coodernadorExists) {
      return res.status(200).json({ error: "Codigo Pessoa ja cadastrado." });
    }

    await Usuario_Coordenador.create(
      {
        cod_pessoa: req.body.usuario_coordenador.cod_pessoa,
        Usuario: req.body.usuario,
      },
      {
        include:
          { model: Usuario, as: "Usuario" }
      }
    )
      .then(usuario_coordenador => {
        usuario_coordenador.Usuario.senha = undefined;
        return res.status(201).json({
          usuario: usuario_coordenador.Usuario,
          token: generateToken({
            id_usuario: usuario_coordenador.Usuario.id,
            tipo_usuario: usuario_coordenador.Usuario.id_tipo_usuario
          })
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

      const coordenadores = await Usuario_Coordenador.findAll({
        attributes: ["id", "cod_pessoa"],
        order: [["id", "ASC"]]
      })
      const coordenador = coordenadores.slice(startIndex, endIndex)
      try{
        return res.status(201).json({
              coordenador,  
              currentPage: page,
              previousPage: startIndex > 0 ? page - 1 : "Nao existe pagina anterior",
              nextPage: endIndex < coordenadores.length ? page + 1 : "Nao existe pagina posterior",
              limit: limit
          });
      }
      catch(err){
        console.log("ERRO: " + err);
      };
  }

  async showByUsuario(req, res) {
    const usuario = await Usuario.findOne({
      where: { id: req.params.usuario }
    });
    await Usuario_Coordenador.findOne({
      where: { id_usuario: usuario.id }
    })
      .then(usuario_coordenador => {
        return res.status(201).json({
            usuario_coordenador
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async showById(req, res) {
    await Usuario_Coordenador.findOne({
      where: { id: req.params.id }
    })
      .then(usuario_coordenador => {
        return res.status(201).json({
            usuario_coordenador
        });
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async update(req, res) {
    routes.use(authMiddleware);
    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email }
    });

    const usuarioExists = await Usuario.findOne({
      where: { usuario: req.body.usuario.usuario }
    });

    if (usuarioExists) {
      return res.status(200).json({ error: "Usuario ja existe." });
    } else if (emailExists) {
      return res.status(200).json({ error: "Email ja esta em uso." });
    }

    const filtro = {
      where: { id_usuario: req.id_usuario },
      include:
        { model: Usuario, as: "Usuario" }
    };

    Usuario_Coordenador.findOne(filtro)
      .then(async usuario_coordenador => {
        if (usuario_coordenador) {
          const update_usuario = await usuario_coordenador.Usuario.update(
            req.body.usuario
          );
          const update_usuario_coordenador = await usuario_coordenador.update(
            req.body.usuario_coordenador
          );
          update_usuario.senha = undefined;
          return res.status(201).json({
            usuario: update_usuario
          });
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
     
    if(req.tipo_usuario === 3){
      return res.status(403).json({
        error: "Requisição deve ser feita por outro usuario" 
      })

    }

    let query = req.params.query.split('+');
    let coordenador=[];
    for(let i=0;i<query.length;i++){
      coordenador.push(await Usuario_Coordenador.findAll({
        where :{materia: {[Op.iLike]: "%"+query[i]+"%"}},
        include:{
          model:Usuario, as: "Usuario",
          attributes: ['nome', 'email']
        },
        attributes: ['telefone_celular', 'materia'],
      }))}

      if(coordenador){
        return res.status(200).json(coordenador);
      }else{
        return res.status(200).json({error:"Nenhum Coordenador encontrado"});
      }
  }

  async indexByNome(req, res) {

    let query = req.params.query.split('+');
    let usuario=[];
    let usuarioList=[];
    for(let i=0;i<query.length;i++){
     usuario.push( usuarioList = await Usuario.findAll({
        where :[{nome: {[Op.iLike]: "%"+query[i]+"%"}}, {id_tipo_usuario: 1}]
    }))}

    let coordenador=[];
    for(let i=0;i<usuarioList.length;i++){
        coordenador.push(await Usuario_Coordenador.findAll({
            where : {id_usuario: usuarioList[i].id},
            include:{
              model:Usuario, as: "Usuario",
              attributes: ['nome', 'email']
            },
            attributes: ['telefone_celular', 'materia'],
      }))}

      if(coordenador){
        return res.status(200).json(coordenador);
      }else{
        return res.status(200).json({error:"Nenhum Coordenador encontrado"});
      }
    }
}

export default new UsuarioCoordenadorController();
