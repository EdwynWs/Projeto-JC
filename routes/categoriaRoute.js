import express from 'express';
import categoriaController from '../controllers/categoriaController.js';
import auth from "../middlewares/auth.js";

const router = express.Router();

const controller = new categoriaController();

router.post("/cadastrar", auth, (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Categoria']
    //#swagger.summary = 'Cadastrar'
    controller.cadastrar(req, res);
});

router.get("/listar", auth, (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Categoria']
    //#swagger.summary = 'Listar'
    controller.listar(req, res);
});

router.delete("/excluir/:id", auth, (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Categoria']
    //#swagger.summary = 'Excluir'
    controller.excluir(req, res);
});

router.put("/modificar/:id", auth, (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Categoria']
    //#swagger.summary = 'Modificar'
    controller.modificar(req, res);
});

router.get("/buscar", auth, (req, res) => {
        /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Categoria']
    //#swagger.summary = 'Buscar'
    controller.buscarPorNome(req, res);
});

export default router;