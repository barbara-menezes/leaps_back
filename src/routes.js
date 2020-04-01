import {
  Router
} from "express";

import UsuarioController from "./app/controllers/UsuarioController";
import SessionController from "./app/controllers/SessionController";
import UsuarioMonitorController from "./app/controllers/UsuarioMonitorController";
import UsuarioCoordenadorController from "./app/controllers/UsuarioCoordenadorController";
import DisciplinaController from "./app/controllers/DisciplinaController";
import AlunoController from "./app/controllers/AlunoController"

import validateUsuarioStore from "./app/validators/UsuarioStore";
import validateMonitorStore from "./app/validators/MonitorStore";
import validateCoordenadorStore from "./app/validators/CoordenadorStore";
import validateDisciplinaStore from "./app/validators/DisciplinaStore";
import validateAlunoStore from "./app/validators/AlunoStore";

import validateUsuarioUpdate from "./app/validators/UsuarioUpdate";
import validateMonitorUpdate from "./app/validators/MonitorUpdate";
import validateCoordenadorUpdate from "./app/validators/CoordenadorUpdate";
import validateAlunoUpdate from "./app/validators/AlunoUpdate";

import authMiddleware from "./app/middlewares/auth";
import Aluno from "./app/models/Aluno";

const routes = new Router();
routes.get("/", (req, res) => {
  return res.status(200).json("tudo certo");
});

routes.post("/sessions", SessionController.store);



routes.post(
  "/aluno",
  AlunoController.store
);

routes.put(
  "/aluno",
  validateAlunoUpdate,
  AlunoController.update
);

routes.post("/disciplina", DisciplinaController.store);
routes.get("/disciplinas", DisciplinaController.index);

routes.get("/alunos", AlunoController.index);

//essas rotas são dependências
// só pode criar disciplinas se tiver um usuário
// routes.get('/aluno/:id_aluno/disciplinas', DisciplinaController.index);
// routes.get('/aluno/:id_aluno/disciplinas', DisciplinaController.indexById);

routes.get('/aluno/:id_aluno/disciplinas', DisciplinaController.viewAllDisciplina);

// routes.post('/aluno/:id_aluno/disciplinas', DisciplinaController.store);
routes.post('/aluno/:id_aluno/disciplinas', DisciplinaController.storeOnlyAluno);

routes.delete('/aluno/:id_aluno/disciplinas', DisciplinaController.delete);



routes.post(
  "/monitor",
  validateMonitorStore,
  validateUsuarioStore,
  UsuarioMonitorController.store
);

routes.post(
  "/coordenador",
  validateCoordenadorStore,
  validateUsuarioStore,
  UsuarioCoordenadorController.store
);

routes.post("/esqueciSenha", SessionController.forgotpassword);
routes.patch("/resetarSenha/:token", SessionController.resetPass);

routes.get("/usuario/usuarioExiste/:usuario", UsuarioController.UsuarioExists);
routes.get("/usuario/emailExiste/:email", UsuarioController.EmailExists);

routes.use(authMiddleware);

routes.patch("/usuario", UsuarioController.updateSenha);

routes.put(
  "/monitor",
  validateMonitorUpdate,
  validateUsuarioUpdate,
  UsuarioMonitorController.update
);

routes.put(
  "/coordenador",
  validateCoordenadorUpdate,
  validateUsuarioUpdate,
  UsuarioCoordenadorController.update
);

routes.get("/monitor/pesquisa/:query?", UsuarioMonitorController.indexByQuery);
routes.get("/monitor/pesquisa/nome/:query?", UsuarioMonitorController.indexByNome);
routes.get("/coordenador/pesquisa/:query?", UsuarioCoordenadorController.indexByQuery);
routes.get("/coordenador/pesquisa/nome/:query?", UsuarioCoordenadorController.indexByNome);
routes.get("/aluno/pesquisa/:query?", AlunoController.indexByQuery);
routes.get("/aluno/pesquisa/nome/:query?", AlunoController.indexByNome);
routes.get("/disciplina/pesquisa/:query?", DisciplinaController.indexByQuery);
routes.get("/disciplina/pesquisa/nome/:query?", DisciplinaController.indexByNome);

routes.get(
  "/monitor/usuario/:usuario",
  UsuarioMonitorController.showByUsuario
);

routes.get(
  "/coordenador/usuario/:usuario",
  UsuarioCoordenadorController.showByUsuario
);

routes.get("/monitor/:id", UsuarioMonitorController.showById);
routes.get("/monitor", UsuarioMonitorController.index);
routes.get("/coordenador/:id", UsuarioCoordenadorController.showById);
routes.get("/coordenador", UsuarioCoordenadorController.index);
routes.get("/aluno/:id", AlunoController.showById);
routes.get("/disciplina/:id", DisciplinaController.showById);

routes.delete("/aluno/:id", AlunoController.delete);
routes.delete("/disciplina/:id", DisciplinaController.delete);

export default routes;