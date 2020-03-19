import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuario = Yup.object().shape({
      nome: Yup.string(),
      usuario: Yup.string(),
      email: Yup.string().email()
    });

    await schemaUsuario.validate(req.body.usuario, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(423)
      .json({ error: "Campo usuario não esta de acordo", messages: err.inner });
  }
};
