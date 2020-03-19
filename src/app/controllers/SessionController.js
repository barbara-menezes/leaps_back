import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import * as Yup from "yup";

function cryptPass(senha) {
  if (senha) {
    return bcrypt.hash(senha, 10);
  }
}

import Usuario from "../models/Usuario";
import Token_Senha from "../models/Token_Senha";
import authConfig from '../../config/auth';

import mailer from '../../config/mailer';

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
  return token;
}


class SessionController {

  async store(req, res) {
    const schema = Yup.object().shape({
      usuario: Yup.string().required(),
      senha: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(409).json({ error: 'Campos não preenchidos corretamente' });
    }

    const { usuario, senha } = req.body;

    const usuarioEmail = await Usuario.findOne({ where: { email: usuario } });
    const usuarioLogin = await Usuario.findOne({ where: { usuario: usuario}})

    let user = '';

    usuarioEmail ? (user = usuarioEmail) : (user=usuarioLogin);
    
    if (!user) {
      return res.status(409).json({ error: 'Usuario Não existe' });
    }

    if (!(await user.checkPassword(senha))) {
      return res.status(409).json({ error: 'Senha Invalida' });
    }

    user.senha=undefined;

    return res.status(200).json({
      user,
      token: generateToken({
        id_usuario: user.id,
        tipo_usuario: user.id_tipo_usuario
      })
    });
  }

  async forgotpassword(req, res){
    let usuario = req.body.usuario;

    const loginEmail = await Usuario.findOne({ where: { email: usuario } });
    const loginUsuario = await Usuario.findOne({ where: { usuario: usuario}});

    (loginEmail)?usuario=loginEmail:usuario=loginUsuario;

    if(!usuario){
      return res.status(409).send({error: 'Usuario não encontrado'});
  }

    const token = crypto.randomBytes(2).toString('hex').toUpperCase();;
    const dt_expiracao = new Date();
    dt_expiracao.setHours(dt_expiracao.getHours()+1);

    await Token_Senha.create({
      token:token,
      dt_expiracao:dt_expiracao,
      id_usuario:usuario.id,
    }).then(async (novoToken)=>{

      await mailer.sendMail({
        to: usuario.email,
        from: 'barbara.menezes@live.com',
        template: 'auth/forgotPass',
        subject: 'Recuperação de Senha Inclu Hub',
        context: {token}
    },(err) => {
        if(err){
            return res.status(417).send({error: 'erro: '+err});
        }
    });

      res.status(201).json({
        msg:"Email de recuperação enviado para: "+usuario.email
      })
    }).catch((err)=>{
      res.status(500).json({
        error:"erro no servidor: "+err
      })
    })
  }

  async resetPass(req,res){
    const schema = Yup.object().shape({
      senha: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(409).json({ error: 'Campos não preenchidos corretamente' });
    }    

    if(!req.params.token){
      return res.status(409).send({error: 'Token não disponibilizado'});
    }

    const tokenUsuario = await Token_Senha.findOne({
      where:{token:req.params.token}
    })

    if(!tokenUsuario){
      return res.status(409).send({error: 'Token não existe'});
    }

    const usuario = await Usuario.findOne({where:{id:tokenUsuario.id_usuario}});

    if(!usuario){
      return res.status(409).send({error: 'Usuario não encontrado'});
    }

    const now = new Date();

    if(now > tokenUsuario.dt_expiracao){
        await tokenUsuario.destroy();
        return res.status(400).send({error: 'Token expirado'});
    }
    req.body.senha = await cryptPass(req.body.senha);
    await usuario.update({
      senha: req.body.senha,
    }).then(async (novaSenha)=>{
      usuario.senha=undefined;
      await tokenUsuario.destroy();
      res.status(201).json({
        usuario,
        token: generateToken({
          id_usuario: usuario.id,
          tipo_usuario: usuario.id_tipo_usuario
        })
      })
    }).catch((err)=>{
      res.status(500).json({
        err:"erro no servidor"+err
      })
    })
  }
}

export default new SessionController();