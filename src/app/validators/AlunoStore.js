import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaAluno = Yup.object().shape({
      matricula: Yup.string().required(),
      nome: Yup.string().required(),
      telefone: Yup.string().required(),
      email: Yup.string().required()
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
