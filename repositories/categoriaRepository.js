import categoriaEntity from "../entities/categoriaEntity.js";
import Repository from "./repository.js";
import Database from "../db/database.js";

export default class categoriaRepository extends Repository{

    constructor(){
        super();
    }

   async cadastrar(entidade) {

        let sql = "INSERT INTO categoria(cat_nome, cat_descricao, cat_ativo)VALUES (?, ?, ?)";

        let valores = [entidade.catNome, entidade.catDescricao, entidade.catAtivo];

        let result = await this.banco.ExecutaComandoLastInserted(sql, valores);

        entidade.catID = result;

        return true;
    }

    async listar() {

        let sql = "SELECT * FROM categoria";

        let rows = await this.banco.ExecutaComando(sql);

        let lista = [];

        for (let row of rows) {
            lista.push( new categoriaEntity(row["cat_id"], row["cat_nome"], row["cat_descricao"], row["cat_ativo"]) );
        }

        return lista;
    }

    async excluir(id) {

        let sql = "DELETE FROM categoria WHERE cat_id = ?";

        let valores = [id];

        let result = await this.banco.ExecutaComando(sql, valores);

        return result;
    }

    async modificar(entidade) {

        let sql = "UPDATE categoria SET cat_nome = ?, cat_descricao = ?, cat_ativo = ? WHERE cat_id = ?";

        let valores = [entidade.catNome, entidade.catDescricao, entidade.catAtivo, entidade.catID];

        let result = await this.banco.ExecutaComando(sql, valores);

        return result;
    }

    async buscarPorNome(nome) {

        let sql = "SELECT * FROM categoria WHERE cat_nome LIKE ?";

        let valores = [`%${nome}%`];

        let rows = await this.banco.ExecutaComando(sql, valores);

        let lista = [];

        for (let row of rows) {
            lista.push(new categoriaEntity(row["cat_id"], row["cat_nome"], row["cat_descricao"], row["cat_ativo"]) );
        }

        return lista;
    }
}