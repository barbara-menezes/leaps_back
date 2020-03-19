import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuarioMonitor = Yup.object().shape({
      matricula: Yup.string().required(),
      telefone_celular: Yup.string(),
      dt_nascimento: Yup.string().required(),
      materia: Yup.string().required()
    });

    await schemaUsuarioMonitor.validate(req.body.usuario_monitor, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo usuario monitor não esta de acordo",
      messages: err.inner
    });
  }
};
