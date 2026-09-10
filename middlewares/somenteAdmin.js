const PERFIL_ADMIN = 2;

export default async function somenteAdmin(req, res, next) {

    try {

        if (!req.usuario) {
            return res.status(401).json({
                msg: "Usuário não autenticado"
            });
        }

        if (Number(req.usuario.per_id) !== PERFIL_ADMIN) {
            return res.status(403).json({
                msg: "Acesso permitido somente para administradores"
            });
        }

        next();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            msg: "Erro ao verificar permissão"
        });

    }

}