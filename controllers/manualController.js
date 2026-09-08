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


    async cadastrar(req, res){
        try {
            let usuID = req.usuario.usu_id;

            let {manNome, manVoltagem, catID, manChaveR2} = req.body;

            let manAtivo = true;
            let manDataCadastro = new Date();

            if(!manNome){
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

            let manual = new manualEntity(null, manNome, manVoltagem, catID, usuID, manChaveR2, manAtivo, manDataCadastro);

            if (!manual.validar()){
                return res.status(400).json({
                    msg: "Parâmetros inválidos"
                });
            }

            await this.#repoManual.cadastrar(manual);

            return res.status(201).json({
                msg: "Manual cadastrado com sucesso",
                manual: manual
            });

        }
        catch(error){
            console.error(error);
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


    async excluir(req, res){
        try {
            let {id} = req.params;

            if (!id){
                return res.status(400).json({
                    msg: "ID do manual não informado"
                });
            }

            let result = await this.#repoManual.excluir(id);

            if (result){
                return res.status(200).json({
                    msg: "Manual excluído com sucesso"
                });
            }

            return res.status(404).json({
                msg: "Manual não encontrado"
            });

        } 
        catch(error){
            console.error(error);
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

            const manual = await this.repository.buscarPorId(id);

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

            const url = await r2Service.gerarUrlArquivo(
                manual.manChaveR2,
                manual.manNome
            );

            return res.status(200).json({
                sucesso: true,
                url: url,
                expiraEm: Number(process.env.R2_URL_EXPIRATION) || 900
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