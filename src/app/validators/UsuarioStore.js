import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuario = Yup.object().shape({
      nome: Yup.string().required(),
      usuario: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required(),
      id_tipo_usuario: Yup.number().required()
    });

    await schemaUsuario.validate(req.body.usuario, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(423)
      .json({ error: "Campo usuario não esta de acordo", messages: err.inner });
  }
};
