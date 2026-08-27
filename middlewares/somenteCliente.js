const PERFIL_CLIENTE = 1;

export function somenteCliente(req, res, next) {

    try {

        if (!req.usuario) {
            return res.status(401).json({
                msg: "Usuário não autenticado"
            });
        }

        if (Number(req.usuario.per_id) !== PERFIL_CLIENTE) {
            return res.status(403).json({
                msg: "Acesso permitido somente para clientes"
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