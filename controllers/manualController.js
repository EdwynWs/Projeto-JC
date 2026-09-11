import manualEntity from "../entities/manualEntity.js";
import manualRepository from "../repositories/manualRepository.js";
import Repository from "../repositories/repository.js";
import r2Service from "../db/r2Service.js";

export default class manualController {

    #repoManual;
    #repo;

    constructor() {
        this.#repoManual = new manualRepository();
        this.#repo = new Repository();
    }


    async cadastrar(req, res) {

        try {

            const usuID = req.usuario.usu_id;

            const {
                manNome,
                manVoltagem,
                catID
            } = req.body;

            if (!manNome) {
                return res.status(400).json({
                    msg: "O nome do manual é obrigatório"
                });
            }

            if (!manVoltagem) {
                return res.status(400).json({
                    msg: "A voltagem do manual é obrigatória"
                });
            }

            if (!catID) {
                return res.status(400).json({
                    msg: "A categoria do manual é obrigatória"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    msg: "O arquivo PDF é obrigatório"
                });
            }

            const nomeOriginal =
                req.file.originalname;

            const nomeSeguro =
                nomeOriginal
                    .replace(/\s+/g, "-")
                    .replace(/[^a-zA-Z0-9._-]/g, "");

            const chaveR2 =
                `manuais/${Date.now()}-${nomeSeguro}`;

            await r2Service.enviarArquivo(
                chaveR2,
                req.file
            );

            const manual = new manualEntity(
                null,
                manNome,
                manVoltagem,
                catID,
                usuID,
                chaveR2,
                true,
                new Date()
            );

            if (!manual.validar()) {

                await r2Service.excluirArquivo(
                    chaveR2
                );

                return res.status(400).json({
                    msg: "Parâmetros inválidos"
                });
            }

            await this.#repoManual.cadastrar(
                manual
            );

            return res.status(201).json({
                msg: "Manual cadastrado com sucesso",
                manual
            });

        } catch (error) {

            console.error(
                "Erro ao cadastrar manual:",
                error
            );

            return res.status(500).json({
                msg: "Erro ao cadastrar manual"
            });
        }
    }

    
    async listar(req, res) {

        try {

            const { categoria } = req.query;

            let lista;

            if (categoria) {

                if (isNaN(Number(categoria))) {

                    return res.status(400).json({
                        msg: "Categoria inválida"
                    });

                }

                lista =
                    await this.#repoManual.listarPorCategoria(
                        Number(categoria)
                    );

            } else {

                lista =
                    await this.#repoManual.listar();

            }

            return res.status(200).json(lista);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                msg: "Erro ao listar manuais"
            });

        }

    }


    async excluir(req, res) {

        try {
            
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    msg: "ID do manual não informado"
                });
            }
            
            const manual =
                await this.#repoManual.buscarPorId(id);
            
            if (!manual) {
                return res.status(404).json({
                    msg: "Manual não encontrado"
                });
            }
            
            // Primeiro remove o arquivo do R2
            if (manual.manChaveR2) {
                
                await r2Service.excluirArquivo(
                    manual.manChaveR2
                );
            }
            
            // Depois remove o registro do banco
            const resultado =
                await this.#repoManual.excluir(id);
            
            if (!resultado) {
                
                return res.status(404).json({
                    msg: "Manual não encontrado"
                });
            }
            
            return res.status(200).json({
                msg: "Manual excluído com sucesso"
            });
            
        } catch (error) {
            
            console.error(
                "Erro ao excluir manual:",
                error
            );
            
            return res.status(500).json({
                msg: "Erro ao excluir manual"
            });
        }
    }

    async modificar(req, res){
        try {
            let {id} = req.params;
            let {manNome, manVoltagem, catID, manChaveR2, manAtivo} = req.body;

            if (!id){
                return res.status(400).json({
                    msg: "ID do manual não informado"
                });
            }

            if (!manNome){
                return res.status(400).json({
                    msg: "O nome do manual é obrigatório"
                });
            }

            if (!manVoltagem){
                return res.status(400).json({
                    msg: "A voltagem do manual é obrigatória"
                });
            }

            if (!catID){
                return res.status(400).json({
                    msg: "A categoria do manual é obrigatória"
                });
            }

            if (!manChaveR2){
                return res.status(400).json({
                    msg: "A chave do arquivo no R2 é obrigatória"
                });
            }

            let manual = new manualEntity(id, manNome, manVoltagem, catID, null, manChaveR2, manAtivo, null);

            let result = await this.#repoManual.modificar(manual);

            if (result){
                return res.status(200).json({
                    msg: "Manual modificado com sucesso"
                });
            }

            return res.status(404).json({
                msg: "Manual não encontrado"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao modificar manual"
            });
        }
    }


    async buscarPorNome(req, res) {
        try{
            let {nome} = req.query;

            if (!nome){
                return res.status(400).json({
                    msg: "Informe o nome do manual"
                });
            }

            let lista = await this.#repoManual.buscarPorNome(nome);

            return res.status(200).json(lista);

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao buscar manual"
            });
        }
    }

    async abrirArquivo(req, res) {

        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {

                return res.status(400).json({
                    sucesso: false,
                    mensagem: "ID do manual inválido."
                });

            }

            const manual = await this.#repoManual.buscarPorId(id);

            if (!manual) {

                return res.status(404).json({
                    sucesso: false,
                    mensagem: "Manual não encontrado."
                });

            }

            if (!manual.manAtivo) {

                return res.status(403).json({
                    sucesso: false,
                    mensagem: "Este manual está inativo."
                });

            }

            if (!manual.manChaveR2) {

                return res.status(404).json({
                    sucesso: false,
                    mensagem: "Arquivo deste manual não está configurado no R2."
                });

            }

            const baixar = req.query.download === "1";

            const url =
                 await r2Service.gerarUrlArquivo(
                     manual.manChaveR2,
                     manual.manNome,
                     baixar
                 );

            return res.status(200).json({
                sucesso: true,
                url: url,
                expiraEm: Number(process.env.B2_URL_EXPIRATION) || 900
            });

        } catch (error) {

            console.error(
                "Erro ao gerar URL do manual:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao gerar acesso ao arquivo."
            });
        }
    }
}