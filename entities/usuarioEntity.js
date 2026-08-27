


export default class UsuarioEntity {

    #usuarioId;
    #usuarioNome;
    #usuarioEmail;
    #usuarioSenha;
    #perID;
    #usuarioAtivo;


    get usuarioId(){
        return this.#usuarioId;
    }

    set usuarioId(value){
        this.#usuarioId = value;
    }

    get usuarioNome(){
        return this.#usuarioNome;
    }

    set usuarioNome(value){
        this.#usuarioNome = value;
    }

    get usuarioEmail(){
        return this.#usuarioEmail;
    }

    set usuarioEmail(value){
        this.#usuarioEmail = value;
    }

    get usuarioSenha(){
        return this.#usuarioSenha;
    }

    set usuarioSenha(value){
        this.#usuarioSenha = value;
    }

    get perID(){
        return this.#perID;
    }

    set perID(value){
        this.#perID = value;
    }

    get usuarioAtivo(){
        return this.#usuarioAtivo;
    }

    set usuarioAtivo(value){
        this.#usuarioAtivo = value;
    }

    constructor(usuarioId, usuarioNome, usuarioEmail, usuarioSenha, perID, usuarioAtivo){
        this.#usuarioId = usuarioId;
        this.#usuarioNome = usuarioNome;
        this.#usuarioEmail = usuarioEmail;
        this.#usuarioSenha = usuarioSenha;
        this.#perID = perID;
        this.#usuarioAtivo = usuarioAtivo;
    }

    toJSON(){
        return{
            id: this.#usuarioId,
            nome: this.#usuarioNome,
            email: this.#usuarioEmail,
            perID: this.#perID,
            Ativo: this.#usuarioAtivo
            //tirei a senha daqui pq a senha não pode retornar pra tela lá
        }
    }

    validar(){
        if(this.#usuarioNome != null && this.#usuarioEmail != null && this.#usuarioSenha != null && this.#perID != null &&this.#usuarioAtivo != null && this.#usuarioEmail.includes("@")){
            return true;
        }
        return false;
    }

    static toMap(coluna){
        let usuario = new UsuarioEntity(
            coluna["usu_id"],
            coluna["usu_nome"],
            coluna["usu_email"],
            coluna["usu_senha"],
            coluna["per_id"],
            coluna["usu_ativo"]
        )
        return usuario;
    }
}