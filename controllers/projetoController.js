import ProjetoEntity from "../entities/projetoEntity.js";
import ProjetoRepository from "../repositories/projetoRepository.js";
import r2Service from "../db/r2Service.js";

class ProjetoController {

    constructor() {
        this.repo = new ProjetoRepository();
    }

    async cadastrar(req, res) {

        try {

            const {
                proNome,
                proCodigo,
                proDescricao,
                catID
            } = req.body;

            if (!proNome || !catID) {

                return res.status(400).json({
                    sucesso: false,
                    msg: "Nome e categoria são obrigatórios."
                });
            }

            if (!req.file) {

                return res.status(400).json({
                    sucesso: false,
                    msg: "O arquivo do projeto é obrigatório."
                });
            }

            if (
                req.file.mimetype !== "application/pdf"
            ) {

                return res.status(400).json({
                    sucesso: false,
                    msg: "Apenas arquivos PDF são permitidos."
                });
            }

            const nomeSeguro = req.file.originalname
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9.-]/g, "-");

            const chave = `projetos/${Date.now()}-${nomeSeguro}`;

            await r2Service.enviarArquivo(
                chave,
                req.file
            );

            const projeto = new ProjetoEntity(
                null,
                proNome.trim(),
                proCodigo?.trim() || null,
                proDescricao?.trim() || null,
                Number(catID),
                req.usuario.usu_id,
                chave,
                req.file.originalname,
                req.file.mimetype,
                req.file.size,
                1,
                new Date(),
                null
            );

            const resultado =
                await this.repo.cadastrar(projeto);

            return res.status(201).json({
                sucesso: true,
                msg: "Projeto cadastrado com sucesso.",
                projeto: resultado
            });

        } catch (error) {

            console.error(
                "Erro ao cadastrar projeto:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                msg: "Erro ao cadastrar projeto."
            });
        }
    }

    async listar(req, res) {

        try {

            const lista = await this.repo.listar();

            return res.status(200).json(lista);

        } catch (error) {

            console.error(
                "Erro ao listar projetos:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                msg: "Erro ao listar projetos."
            });
        }
    }

    async buscarPorId(req, res) {

        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {

                return res.status(400).json({
                    sucesso: false,
                    msg: "ID inválido."
                });
            }

            const projeto =
                await this.repo.buscarPorId(id);

            if (!projeto) {

                return res.status(404).json({
                    sucesso: false,
                    msg: "Projeto não encontrado."
                });
            }

            return res.status(200).json(projeto);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                sucesso: false,
                msg: "Erro ao buscar projeto."
            });
        }
    }

    async abrirArquivo(req, res) {

        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {

                return res.status(400).json({
                    sucesso: false,
                    msg: "ID inválido."
                });
            }

            const projeto =
                await this.repo.buscarPorId(id);

            if (!projeto) {

                return res.status(404).json({
                    sucesso: false,
                    msg: "Projeto não encontrado."
                });
            }

            if (Number(projeto.proAtivo) !== 1) {

                return res.status(403).json({
                    sucesso: false,
                    msg: "Projeto inativo."
                });
            }

            const url =
                await r2Service.gerarUrlArquivo(
                    projeto.proChaveR2,
                    projeto.proNomeArquivo
                );

            return res.status(200).json({
                sucesso: true,
                url,
                expiraEm:
                    Number(process.env.R2_URL_EXPIRATION) || 900
            });

        } catch (error) {

            console.error(
                "Erro ao abrir projeto:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                msg: "Erro ao gerar acesso ao arquivo."
            });
        }
    }

    async excluir(req, res) {

        try {

            const id = Number(req.params.id);

            const projeto =
                await this.repo.buscarPorId(id);

            if (!projeto) {

                return res.status(404).json({
                    sucesso: false,
                    msg: "Projeto não encontrado."
                });
            }

            await r2Service.excluirArquivo(
                projeto.proChaveR2
            );

            await this.repo.excluir(id);

            return res.status(200).json({
                sucesso: true,
                msg: "Projeto excluído com sucesso."
            });

        } catch (error) {

            console.error(
                "Erro ao excluir projeto:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                msg: "Erro ao excluir projeto."
            });
        }
    }
}

export default ProjetoController;