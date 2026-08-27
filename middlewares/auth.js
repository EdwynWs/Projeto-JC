import jwt from "jsonwebtoken";
import UsuarioRepository from "../repositories/usuarioRepositoy.js";

const SECRET = process.env.JWT_SECRET || "segredo";

export default async function autenticar(req, res, next) {

    try {

        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                msg: "Token não informado"
            });
        }

        let decoded = jwt.verify(token, SECRET);

        console.log("JWT decodificado:", decoded);

        let repo = new UsuarioRepository();

        let usuario = await repo.buscarPorId(decoded.usu_id);

        if (!usuario) {
            return res.status(404).json({
                msg: "Usuário não encontrado"
            });
        }

        if (usuario.usu_ativo !== 1) {
            return res.status(403).json({
                msg: "Usuário inativo"
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            msg: "Token inválido"
        });
    }
}