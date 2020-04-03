import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuarioCoordenador = Yup.object().shape({
      cod_pessoa: Yup.string().required()
    });

    await schemaUsuarioCoordenador.validate(req.body.usuario_coordenador, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo usuario coordenador não esta de acordo",
      messages: err.inner
    });
  }
};
