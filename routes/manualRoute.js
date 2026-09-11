import express from 'express';
import manualController from '../controllers/manualController.js';
import auth from '../middlewares/auth.js'
import somenteAdmin from "../middlewares/somenteAdmin.js";
import multer from "multer";

const router = express.Router();

const controller = new manualController();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {

        if (file.mimetype !== "application/pdf") {
            return cb(
                new Error("Apenas arquivos PDF são permitidos.")
            );
        }

        cb(null, true);
    }
});



router.post("/cadastrar", auth, somenteAdmin, upload.single("arquivo"), (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Manual']
    //#swagger.summary = 'Cadastrar Manual'
    controller.cadastrar(req, res);
});

router.get("/listar", auth, (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Manual']
    //#swagger.summary = 'Listar Manual'
    controller.listar(req, res);
});

router.delete("/excluir/:id", auth, somenteAdmin, (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Manual']
    //#swagger.summary = 'Excluir Manual'
    controller.excluir(req, res);
});

router.put("/modificar/:id", auth, somenteAdmin, (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Manual']
    //#swagger.summary = 'Modificar Manual'
    controller.modificar(req, res);
});

router.get("/buscar", auth, (req, res) => {
        /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Manual']
    //#swagger.summary = 'Buscar Manual'
    controller.buscarPorNome(req, res);
});

router.get("/:id/arquivo", auth, (req, res) => {
    /* #swagger.security = [{
    "jwt": []
    }] */
    //#swagger.tags = ['Manual']
    //#swagger.summary = 'Abrir PDF'
    controller.abrirArquivo(req, res)
});

export default router;