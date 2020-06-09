import { Router } from "express";

import UsuarioController from "./app/controllers/UsuarioController";
import SessionController from "./app/controllers/SessionController";
import UsuarioMonitorController from "./app/controllers/UsuarioMonitorController";
import UsuarioCoordenadorController from "./app/controllers/UsuarioCoordenadorController";
import DisciplinaController from "./app/controllers/DisciplinaController";
import AlunoController from "./app/controllers/AlunoController";
import ListaEsperaController from "./app/controllers/ListaEsperaController";

import validateUsuarioStore from "./app/validators/UsuarioStore";
import validateMonitorStore from "./app/validators/MonitorStore";
import validateCoordenadorStore from "./app/validators/CoordenadorStore";
import validateDisciplinaStore from "./app/validators/DisciplinaStore";
import validateAlunoStore from "./app/validators/AlunoStore";
import validateListaEsperaStore from "./app/validators/ListaEsperaStore";

import validateUsuarioUpdate from "./app/validators/UsuarioUpdate";
import validateMonitorUpdate from "./app/validators/MonitorUpdate";
import validateCoordenadorUpdate from "./app/validators/CoordenadorUpdate";
import validateAlunoUpdate from "./app/validators/AlunoUpdate";
import validateDisciplinaUpdate from "./app/validators/DisciplinaUpdate";
import validateListaEsperaUpdate from "./app/validators/ListaEsperaUpdate";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
routes.get("/", (req, res) => {
  return res.status(200).json("tudo certo");
});

routes.post("/sessions", SessionController.store);

//Disciplina
routes.post(
  "/disciplina",
  validateDisciplinaStore,
  DisciplinaController.store
);

routes.put(
  "/disciplina/:id",
  validateDisciplinaUpdate,
  DisciplinaController.update
);

routes.get("/disciplinas", DisciplinaController.index);
routes.get("/disciplina/:id", DisciplinaController.showById);
routes.get("/disciplina/pesquisa/:query?", DisciplinaController.indexByQuery);
routes.get("/disciplina/pesquisa/nome/:query?", DisciplinaController.indexByNome);
routes.delete("/disciplina/:id", DisciplinaController.delete);

//aluno
routes.post(
  "/aluno",
  validateAlunoStore,
  AlunoController.store
);

routes.put(
  "/aluno/:id",
  validateAlunoUpdate,
  AlunoController.update
);

routes.get("/alunos", AlunoController.index);
routes.get("/aluno/:id", AlunoController.showById);
routes.delete("/aluno/:id", AlunoController.delete);
routes.get("/aluno/pesquisa/:query?", AlunoController.indexByQuery);
routes.get("/aluno/pesquisa/nome/:query?", AlunoController.indexByName);

//Lista_Espera
routes.post(
  "/espera",
  validateListaEsperaStore,
  ListaEsperaController.store
);

routes.put(
  "/espera/:id",
  validateListaEsperaUpdate,
  ListaEsperaController.update
);

routes.get("/esperas", ListaEsperaController.index);
routes.get("/espera/:id", ListaEsperaController.showById);
routes.delete("/espera/:id", ListaEsperaController.delete);
routes.get("/espera/pesquisa/:query?", ListaEsperaController.indexByQuery);
routes.get("/espera/pesquisa/status/:query?", ListaEsperaController.indexByStatus);

//Monitor
routes.post(
  "/monitor",
  validateMonitorStore,
  validateUsuarioStore,
  UsuarioMonitorController.store
);

routes.put(
  "/monitor",
  validateMonitorUpdate,
  validateUsuarioUpdate,
  UsuarioMonitorController.update
);

routes.get("/monitor/pesquisa/:query?", UsuarioMonitorController.indexByQuery);
routes.get("/monitor/usuario/:usuario", UsuarioMonitorController.showByUsuario);
routes.get("/monitor/pesquisa/nome/:query?", UsuarioMonitorController.indexByNome);
routes.get("/monitor/:id", UsuarioMonitorController.showById);
routes.get("/monitor", UsuarioMonitorController.index);

//Coordenador
routes.post(
  "/coordenador",
  validateCoordenadorStore,
  validateUsuarioStore,
  UsuarioCoordenadorController.store
);

routes.put(
  "/coordenador",
  validateCoordenadorUpdate,
  validateUsuarioUpdate,
  UsuarioCoordenadorController.update
);

routes.get("/coordenador/pesquisa/:query?", UsuarioCoordenadorController.indexByQuery);
routes.get("/coordenador/pesquisa/nome/:query?", UsuarioCoordenadorController.indexByNome);
routes.get("/coordenador/usuario/:usuario", UsuarioCoordenadorController.showByUsuario);
routes.get("/coordenador/:id", UsuarioCoordenadorController.showById);
routes.get("/coordenador", UsuarioCoordenadorController.index);

//login
routes.post("/esqueciSenha", SessionController.forgotpassword);
routes.patch("/resetarSenha/:token", SessionController.resetPass);
routes.get("/usuario/usuarioExiste/:usuario", UsuarioController.UsuarioExists);
routes.get("/usuario/emailExiste/:email", UsuarioController.EmailExists);

//Autenticação dos usuários
routes.use(authMiddleware); //Tudo que ficar abaixo da autentição precisa de Token
routes.patch("/usuario", UsuarioController.updateSenha);

export default routes;
