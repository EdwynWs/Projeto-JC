import categoriaEntity from "../entities/categoriaEntity.js";
import categoriaRepository from "../repositories/categoriaRepository.js";

export default class categoriaController {

    #repo;

    constructor() {
        this.#repo = new categoriaRepository();
    }

    async cadastrar(req, res){
        try {
            let {catNome, catDescricao, catAtivo} = req.body;

            if(!catNome){
                return res.status(400).json({
                    msg: "O nome da categoria é obrigatório"
                });
            }

            let categoria = new categoriaEntity(0, catNome, catDescricao, catAtivo ?? true);

            let result = await this.#repo.cadastrar(categoria);

            if(result){
                return res.status(201).json({
                    msg: "Categoria cadastrada com sucesso",
                    categoria: categoria
                });
            }

            return res.status(400).json({
                msg: "Não foi possível cadastrar a categoria"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao cadastrar categoria"
            });
        }
    }

    async listar(req, res){
        try {
            let lista = await this.#repo.listar();

            return res.status(200).json(lista);

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao listar categorias"
            });
        }
    }


    async excluir(req, res){
        try {
            let {id} = req.params;

            if(!id) {
                return res.status(400).json({
                    msg: "ID da categoria não informado"
                });
            }

            let result = await this.#repo.excluir(id);

            if(result) {
                return res.status(200).json({
                    msg: "Categoria excluída com sucesso"
                });
            }

            return res.status(404).json({
                msg: "Categoria não encontrada"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao excluir categoria"
            });
        }
    }


    async modificar(req, res){
        try {
            let {id} = req.params;

            let {catNome, catDescricao, catAtivo} = req.body;

            if(!id){
                return res.status(400).json({
                    msg: "ID da categoria não informado"
                });
            }

            if(!catNome){
                return res.status(400).json({
                    msg: "O nome da categoria é obrigatório"
                });
            }

            let categoria = new categoriaEntity(id, catNome, catDescricao, catAtivo);

            let result = await this.#repo.modificar(categoria);

            if(result) {
                return res.status(200).json({
                    msg: "Categoria modificada com sucesso",
                    categoria: categoria
                });
            }
            return res.status(404).json({
                msg: "Categoria não encontrada"
            });

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao modificar categoria"
            });
        }
    }


    async buscarPorNome(req, res){
        try{
            let {nome} = req.query;

            if (!nome){
                return res.status(400).json({
                    msg: "Informe o nome da categoria"
                });
            }

            let lista = await this.#repo.buscarPorNome(nome);

            return res.status(200).json(lista);

        } 
        catch(error){
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao buscar categoria"
            });
        }
    }
}