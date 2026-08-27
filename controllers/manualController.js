import manualEntity from "../entities/manualEntity.js";
import manualRepository from "../repositories/manualRepository.js";
import Repository from "../repositories/repository.js";

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


    async listar(req, res){
        try{
            let lista = await this.#repoManual.listar();
            return res.status(200).json(lista);
        } 
        catch(error){
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
}