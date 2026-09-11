import express from "express";
import multer from "multer";
import ProjetoController from "../controllers/projetoController.js";
import auth from "../middlewares/auth.js";
import somenteAdmin from "../middlewares/somenteAdmin.js";

const router = express.Router();
const controller = new ProjetoController();
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 20 * 1024 * 1024
    }
});

router.post("/cadastrar", auth, somenteAdmin, upload.single("arquivo"), (req, res) => {
        /* #swagger.security = [{
        "jwt": []
        }] */
        //#swagger.tags = ['Projeto']
        //#swagger.summary = 'Cadastrar projetos'
        controller.cadastrar(req, res)
});

router.get("/listar", auth, (req, res) => {
        /* #swagger.security = [{
        "jwt": []
        }] */
        //#swagger.tags = ['Projeto']
        //#swagger.summary = 'Listar projetos'
        controller.listar(req, res)
});

router.get("/:id", auth, (req, res) => {
        /* #swagger.security = [{
        "jwt": []
        }] */
        //#swagger.tags = ['Projeto']
        //#swagger.summary = 'Listar projetos por Id'
        controller.buscarPorId(req, res)
});

router.get("/:id/arquivo", auth, (req, res) => {
        /* #swagger.security = [{
        "jwt": []
        }] */
        //#swagger.tags = ['Projeto']
        //#swagger.summary = 'Listar arquivo por Id'    
        controller.abrirArquivo(req, res)
});

router.delete("/excluir/:id", auth, somenteAdmin, (req, res) => {
        /* #swagger.security = [{
        "jwt": []
        }] */
        //#swagger.tags = ['Projeto']
        //#swagger.summary = 'Deletar projetos por Id'
        controller.excluir(req, res)
});

export default router;