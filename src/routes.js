import { Router } from "express";

import UsuarioController from "./app/controllers/UsuarioController";
import SessionController from "./app/controllers/SessionController";
import UsuarioMonitorController from "./app/controllers/UsuarioMonitorController";
import DisciplinaController from "./app/controllers/DisciplinaController"

import validateUsuarioStore from "./app/validators/UsuarioStore";
import validateMonitorStore from "./app/validators/MonitorStore";
import validateDisciplinaStore from "./app/validators/DisciplinaStore";

import validateUsuarioUpdate from "./app/validators/UsuarioUpdate";
import validateMonitorUpdate from "./app/validators/MonitorUpdate";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
routes.get("/", (req, res) => {
  return res.status(200).json("tudo certo");
});

routes.post("/sessions", SessionController.store);

routes.post(
  "/disciplina",
  DisciplinaController.store
);

routes.get("/disciplinas", DisciplinaController.index);


routes.post(
  "/monitor",
  validateMonitorStore,
  validateUsuarioStore,
  UsuarioMonitorController.store
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

routes.get("/monitor/pesquisa/:query?", UsuarioMonitorController.indexByQuery);
routes.get("/monitor/pesquisa/nome/:query?", UsuarioMonitorController.indexByNome);

routes.get(
  "/monitor/usuario/:usuario",
  UsuarioMonitorController.showByUsuario
);
routes.get("/monitor/:id", UsuarioMonitorController.showById);
routes.get("/monitor", UsuarioMonitorController.index);

export default routes;
