import manualEntity from "../entities/manualEntity.js";
import Repository from "./repository.js";


export default class manualRepository extends Repository{

    constructor(){
        super();
    }    

    async cadastrar(entidade) {
 
         let sql = "INSERT INTO manual(man_nome, man_voltagem, cat_id, usu_id, man_chave_r2, man_ativo, man_data_cadastro)VALUES (?, ?, ?, ?, ?, ?, ?)";
 
         let valores = [entidade.manNome, entidade.manVoltagem, entidade.catID, entidade.usuID, entidade.manChaveR2, entidade.manAtivo, entidade.manDataCadastro];
 
         let result = await this.banco.ExecutaComandoLastInserted(sql, valores);
 
         entidade.manID = result;
 
         return true;
     }
 
    async listar() {
 
         let sql = "SELECT * FROM manual";
 
         let rows = await this.banco.ExecutaComando(sql);
 
         let lista = [];
 
         for (let row of rows) {
             lista.push( new manualEntity(row["man_id"], row["man_nome"], row["man_voltagem"], row["cat_id"], row["usu_id"], row["man_chave_r2"], row["man_ativo"], row["man_data_cadastro"]));
         }
 
         return lista;
     }
 
    async excluir(id) {
 
         let sql = "DELETE FROM manual WHERE man_id = ?";
 
         let valores = [id];
 
         let result = await this.banco.ExecutaComando(sql, valores);
 
         return result;
     }
 
     async modificar(entidade) {
 
         let sql = "UPDATE manual SET man_nome = ?, man_voltagem = ?, cat_id = ?, usu_id = ?, man_chave_r2 = ?, man_ativo = ?, man_id = ? WHERE man_id = ?";
 
         let valores = [entidade.manNome, entidade.manVoltagem, entidade.catID, entidade.manChaveR2, entidade.manAtivo, entidade.manID];
 
         let result = await this.banco.ExecutaComando(sql, valores);
 
         return result;
     }

     async buscarPorNome(nome) {
 
         let sql = "SELECT * FROM manual WHERE man_nome LIKE ?";
 
         let valores = [`%${nome}%`];
 
         let rows = await this.banco.ExecutaComando(sql, valores);
 
         let lista = [];
 
         for (let row of rows) {
             lista.push(new manualEntity(row["man_id"], row["man_nome"], row["man_voltagem"], row["cat_id"], row["usu_id"], row["man_chave_r2"], row["man_ativo"], row["man_data_cadastro"]));
         }
 
         return lista;
     }
}