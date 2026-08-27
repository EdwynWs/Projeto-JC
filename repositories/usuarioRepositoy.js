import UsuarioEntity from "../entities/usuarioEntity.js";
import Repository from "./repository.js";

export default class UsuarioRepository extends Repository{

    constructor(){
        super();
    }

    async cadastrarUsuario(usuario){
        let sql = "INSERT INTO usuario (usu_nome, usu_email, usu_senha, per_id, usu_ativo) VALUES (?, ?, ?, ?, ?)";
        let valores = [usuario.usuarioNome, usuario.usuarioEmail, usuario.usuarioSenha, usuario.perID, usuario.usuarioAtivo];

        let resultado = await this.banco.ExecutaComandoLastInserted(sql, valores);

        usuario.usuarioId = resultado;

        return true;
    }

    async listarUsuarios(){
        let sql = "SELECT * FROM usuario";
        let listaUsuarios = [];

        let colunas = await this.banco.ExecutaComando(sql);

        for(let coluna of colunas){
            listaUsuarios.push(UsuarioEntity.toMap(coluna));
        }
        return listaUsuarios;
    }

    async inativarUsuario(id){
        let sql = "update usuario set usu_ativo = ? where usu_id = ?";
        let valores = [0, id];

        let resultado = await this.banco.ExecutaComandoNonQuery(sql, valores);

        return resultado;
    }

    async obter(id){
        let sql = "select * from usuario where usu_id = ?";
        let valores = [id];

        let colunas = await this.banco.ExecutaComando(sql, valores);

        if(colunas.length > 0){
            let coluna = colunas[0];
            return new UsuarioEntity(coluna['usu_id'], coluna['usu_nome'], coluna['usu_email'], coluna['usu_senha'], coluna["per_id"],coluna['usu_ativo']);     
            
        }
        return null;
    }

    async buscarPorEmail(email){
        let sql = "SELECT * FROM usuario WHERE usu_email = ?";
        let valores = [email];
        
        let resultado = await this.banco.ExecutaComando(sql, valores);
        
        if(resultado.length > 0){
            return UsuarioEntity.toMap(resultado[0]);
        }
    
        return null;

    }

    async buscarPorId(id){
        let sql = "SELECT * FROM usuario WHERE usu_id = ?";
        let valores = [id];
    
        let resultado = await this.banco.ExecutaComando(sql, valores);
        
        if(resultado.length > 0){
            return resultado[0];
        }
    
        return null;
    }
    
    async alterar(entidade){
        let sql = "update usuario set usu_nome =?, usu_email = ?, usu_senha = ?, per_id = ?, usu_ativo = ? Where usu_id = ?";
        let valores = [entidade.usuarioNome, entidade.usuarioEmail, entidade.usuarioSenha, entidade.perID, entidade.usuarioAtivo, entidade.usuarioId];

        let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async deletar(id){
        let sql = "delete from usuario where usu_id = ?";
        let valores = [id];

        let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
}