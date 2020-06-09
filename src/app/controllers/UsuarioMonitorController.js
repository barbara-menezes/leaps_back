import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import Usuario_Monitor from "../models/Usuario_Monitor";
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

class UsuarioMonitorController {
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

    req.body.usuario.senha = await cryptPass(req.body.usuario.senha);

    if (usuarioExists) {
      return res.status(200).json({ error: "Usuario ja existe." });
    } else if (emailExists) {
      return res.status(200).json({ error: "Email ja esta em uso." });
    }else if (matriculaExists) {
      return res.status(200).json({ error: "Matricula ja esta em uso." });
    }

    await Usuario_Monitor.create(
      {
        tipo: req.body.usuario_monitor.tipo,
        Usuario: req.body.usuario,
      },
      {
        include:
          { model: Usuario, as: "Usuario" }
      }
    )
      .then(usuario_monitor => {
        usuario_monitor.Usuario.senha = undefined;
        return res.status(201).json({
          usuario: usuario_monitor.Usuario,
          token: generateToken({
            id_usuario: usuario_monitor.Usuario.id,
            tipo_usuario: usuario_monitor.Usuario.id_tipo_usuario
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

    const monitores = await Usuario_Monitor.findAll({
      attributes: ["id", "tipo"],
      order: [["id", "ASC"]]
    })
    const monitor = monitores.slice(startIndex, endIndex)
    try{
      return res.status(201).json({
            monitor,  
            currentPage: page,
            previousPage: startIndex > 0 ? page - 1 : "Nao existe pagina anterior",
            nextPage: endIndex < monitores.length ? page + 1 : "Nao existe pagina posterior",
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
    await Usuario_Monitor.findOne({
      where: { id_usuario: usuario.id }
    })
      .then(usuario_monitor => {
        return res.status(201).json({
          usuario_monitor
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async showById(req, res) {
    await Usuario_Monitor.findOne({
      where: { id: req.params.id }
    })
      .then(usuario_monitor => {
        return res.status(201).json({
          usuario_monitor
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

    Usuario_Monitor.findOne(filtro)
      .then(async usuario_monitor => {
        if (usuario_monitor) {
          const update_usuario = await usuario_monitor.Usuario.update(
            req.body.usuario
          );
          const update_usuario_monitor = await usuario_monitor.update(
            req.body.usuario_monitor
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
    let monitor=[];
    for(let i=0;i<query.length;i++){
      monitor.push(await Usuario_Monitor.findAll({
        where :{materia: {[Op.iLike]: "%"+query[i]+"%"}},
        include:{
          model:Usuario, as: "Usuario",
          attributes: ['nome', 'email']
        },
        attributes: ['tipo'],
      }))}

      if(monitor){
        return res.status(200).json(monitor);
      }else{
        return res.status(200).json({error:"Nenhum Monitor encontrado"});
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

    let monitor=[];
    for(let i=0;i<usuarioList.length;i++){
        monitor.push(await Usuario_Monitor.findAll({
            where : {id_usuario: usuarioList[i].id},
            include:{
              model:Usuario, as: "Usuario",
              attributes: ['nome', 'email']
            },
            attributes: ['tipo'],
      }))}

      if(monitor){
        return res.status(200).json(monitor);
      }else{
        return res.status(200).json({error:"Nenhum Monitor encontrado"});
      }
    }
}

export default new UsuarioMonitorController();
