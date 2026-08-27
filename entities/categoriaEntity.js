export default class categoriaEntity{

    #catID;
    #catNome;
    #catDescricao;
    #catAtivo;

    get catID(){
        return this.#catID;
    }
    set catID(value){
        this.#catID = value;
    }

    get catNome(){
        return this.#catNome;
    }
    set catNome(value){
        this.#catNome = value;
    }

    get catDescricao(){
        return this.#catDescricao;
    }
    set catDescricao(value){
        this.#catDescricao = value;
    }

    get catAtivo(){
        return this.#catAtivo;
    }
    set catAtivo(value){
        this.#catAtivo = value;
    }

    constructor(catID, catNome, catDescricao, catAtivo){
        this.#catID = catID;
        this.#catNome = catNome;
        this.#catDescricao = catDescricao;
        this.#catAtivo = catAtivo;
    }

    toJSON(){
        return {
            catID: this.#catID,
            catNome: this.#catNome,
            catDescricao: this.#catDescricao,
            catAtivo: this.#catAtivo,
        }
    }

        static toMap(row){
            let categoria = new categoriaEntity(
                row["cat_id"],
                row["cat_nome"],
                row["cat_descricao"],
                row["cat_ativo"],
            );
        return categoria;
    }
}