import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaDisciplina = Yup.object().shape({
      nome_disciplina: Yup.string().required(),
      turno: Yup.string().required(),
      periodo: Yup.number.required(),
      codigo: Yup.number.required(),
    });

    await schemaDisciplina.validate(req.body.disciplina, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo disciplina não esta de acordo",
      messages: err.inner
    });
  }
};
