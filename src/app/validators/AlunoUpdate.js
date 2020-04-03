import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaAluno = Yup.object().shape({
      matricula: Yup.string(),
      nome: Yup.string(),
      telefone: Yup.string(),
      email: Yup.string()
    });

    await schemaAluno.validate(req.body.aluno, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo aluno não esta de acordo",
      messages: err.inner
    });
  }
};
