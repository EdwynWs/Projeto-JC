export default class manualEntity{

    #manID;
    #manNome;
    #manVoltagem;
    #catID;
    #usuID;
    #manChaveR2;
    #manAtivo;
    #manDataCadastro;

    get manID(){
        return this.#manID;
    }
    set manID(value){
        this.#manID = value;
    }

    get manNome(){
        return this.#manNome;
    }
    set manNome(value){
        this.#manNome = value;
    }

    get manVoltagem(){
        return this.#manVoltagem;
    }
    set manVoltagem(value){
        this.#manVoltagem = value;
    }

    get catID(){
        return this.#catID;
    }
    set catID(value){
        this.#catID = value;
    }

    get usuID(){
        return this.#usuID;
    }
    set usuID(value){
        this.#usuID = value;
    }

    get manChaveR2(){
        return this.#manChaveR2;
    }
    set manChaveR2(value){
        this.#manChaveR2 = value;
    }

    get manAtivo(){
        return this.#manAtivo;
    }
    set manAtivo(value){
        this.#manAtivo = value;
    }

    get manDataCadastro(){
        return this.#manDataCadastro;
    }
    set manDataCadastro(value){
        this.#manDataCadastro = value;
    }

    constructor(manID, manNome, manVoltagem, catID, usuID, manChaveR2, manAtivo, manDataCadastro){
        this.#manID = manID;
        this.#manNome = manNome;
        this.#manVoltagem = manVoltagem;
        this.#catID = catID;
        this.#usuID = usuID;
        this.#manChaveR2 = manChaveR2;
        this.#manAtivo = manAtivo;
        this.#manDataCadastro = manDataCadastro;
    }

    toJSON(){
        return {
            manID: this.#manID,
            manNome: this.#manNome,
            manVoltagem: this.#manVoltagem,
            catID: this.#catID,
            usuID: this.#usuID,
            manChaveR2: this.#manChaveR2,
            manAtivo: this.#manAtivo,
            manDataCadastro: this.#manDataCadastro,            
        }
    }

    validar(){
        if(this.#manNome != null && this.#manVoltagem != null && this.#catID != null && this.#usuID != null &&this.#manChaveR2 != null && this.#manAtivo != null && this.#manDataCadastro != null){
            return true;
        }
        return false;
    }
    
    static toMap(row){
       let manual =  new manualEntity(
            row["man_id"],
            row["man_nome"],
            row["man_voltagem"],
            row["cat_id"],
            row["usu_id"],
            row["man_chave_r2"],
            row["man_ativo"],
            row["man_data_cadastro"]
        );
    return manual;
    }

}