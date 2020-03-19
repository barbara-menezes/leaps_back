import Usuario from "../models/Usuario";
import bcrypt from "bcryptjs";
import * as Yup from "yup";

function cryptPass(senha) {
  if (senha) {
    return bcrypt.hash(senha, 10);
  }
}

class UsuarioController {
  async updateSenha(req, res) {
    const schemaSenha = Yup.object().shape({
      senha_antiga: Yup.string().required(),
      senha_atual: Yup.string().required()
    });

    if (!(await schemaSenha.isValid(req.body))) {
      return res.status(200).json({ error: "Campo não esta de acordo" });
    }
    const usuario = await Usuario.findOne({ where: { id: req.id_usuario } });

    if (!usuario) {
      return res.status(200).json({ error: "Nenhum usuario encontrado" });
    }

    if (!(await usuario.checkPassword(req.body.senha_antiga))) {
      return res.status(200).json({ error: "Senha Invalida" });
    }

    req.body.senha_atual = await cryptPass(req.body.senha_atual);

    const updated_usuario = usuario
      .update({
        senha: req.body.senha_atual
      })
      .then(updated_usuario => {
        updated_usuario.senha = undefined;
        return res.status(200).json(updated_usuario);
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async UsuarioExists(req, res) {
    const usuarioExists = await Usuario.findOne({
      where: { usuario: req.params.usuario }
    });

    if (usuarioExists) {
      return res.status(200).json({ error: true });
    } else {
      return res.status(200).json({ error: false });
    }
  }

  async EmailExists(req, res) {
    const emailExists = await Usuario.findOne({
      where: { email: req.params.email }
    });

    if (emailExists) {
      return res.status(200).json({ error: true });
    } else {
      return res.status(200).json({ error: false });
    }
  }
}
export default new UsuarioController();
