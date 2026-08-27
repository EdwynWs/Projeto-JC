import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import auth from '../middlewares/auth.js'

const router = express.Router();

const controladora = new UsuarioController();

router.get("/", auth, (req, res) => {
    //#swagger.tags = ['Usuarios']
    //#swagger.summary = 'Retorna uma lista de todos os usuarios cadastrados'
    controladora.listarUsuarios(req, res);
})

router.get("/logado", auth, (req, res) => {
    //#swagger.tags = ['Usuarios']
    //#swagger.summary = 'Retorna uma lista de todos os usuarios logados'
    controladora.usuarioLogado(req, res);
})

router.post("/", (req, res) => {
    //#swagger.tags = ['Usuarios']
    //#swagger.summary = 'Cadastra um determinado usuario'
    controladora.cadastroUsuario(req, res);
})

router.patch("/:id/inativar", auth, (req, res) => {
    /* #swagger.security = [{
        "jwt": []
    }] */
    //#swagger.tags = ['Usuarios']
    //#swagger.summary = 'Inativa um usuario atraves do seu ID'
    controladora.inativarUsuario(req, res);
})

router.post("/login", (req, res) => {
    //#swagger.tags = ['Usuarios']
    //#swagger.summary = 'Realiza login do usuario'
    //#swagger.description = 'Autentica o usuário e retorna um token JWT'
    controladora.login(req, res);
})

router.post("/logout", (req, res) => {
    //#swagger.tags = ['Usuarios']
    //#swagger.summary = 'Realiza logout do usuario'
    //#swagger.description = 'Remove o cookie de autenticação do usuário'
    controladora.logout(req, res);
})

router.put("/:id",auth, (req, res) => {
    /* #swagger.security = [{
        "jwt": []
    }] */
    //#swagger.tags = ['Usuarios']
    //#swagger.summary = 'Realiza a alteração de um usuario'
    controladora.alterar(req, res);
})

router.get("/:id", (req, res) => {
     //#swagger.tags = ['Usuarios']
     //#swagger.summary = 'Busca um usuario especifico pelo seu ID'
    controladora.obter(req, res);
})

router.delete("/:id", auth, (req, res) => {
  //#swagger.tags = ['Usuarios']
  //#swagger.summary = ['Deletar um usuario identificado pelo ID']
  controladora.deletar(req, res);
})

export default router;