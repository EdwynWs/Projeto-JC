const PERFIL_ADMIN = 2;


function somenteAdmin(req, res, next) {

    try {

        // Usuário não autenticado
        if (!req.usuario) {

            return res.status(401).json({
                msg: "Usuário não autenticado"
            });

        }


        // Usuário não é administrador
        if (Number(req.usuario.per_id) !== PERFIL_ADMIN) {

            return res.status(403).json({
                msg: "Acesso permitido somente para administradores"
            });

        }


        // Usuário é administrador
        next();

    } catch (error) {

        console.error("Erro no middleware somenteAdmin:", error);

        return res.status(500).json({
            msg: "Erro ao verificar permissão"
        });

    }

}


export default somenteAdmin;