import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaListaEspera = Yup.object().shape({
      codigo: Yup.string().required(),
      status: Yup.string().required(),
    });

    await schemaListaEspera.validate(req.body.lista_espera, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo espera não esta de acordo",
      messages: err.inner
    });
  }
};
