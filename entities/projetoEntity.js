export default class ProjetoEntity{

    #proID;
    #proNome;
    #proCodigo;
    #proDescricao;
    #catID;
    #usuID;
    #proChaveR2;
    #proNomeArquivo;
    #proTipoArquivo;
    #proTamanho;
    #proAtivo;
    #proDataCadastro;
    #proDataAtualizacao;

    get proID() {
        return this.#proID;
    }

    set proID(valor) {
        this.#proID = valor;
    }

    get proNome() {
        return this.#proNome;
    }

    set proNome(valor) {
        this.#proNome = valor;
    }

    get proCodigo() {
        return this.#proCodigo;
    }

    set proCodigo(valor) {
        this.#proCodigo = valor;
    }

    get proDescricao() {
        return this.#proDescricao;
    }

    set proDescricao(valor) {
        this.#proDescricao = valor;
    }

    get catID() {
        return this.#catID;
    }

    set catID(valor) {
        this.#catID = valor;
    }

    get usuID() {
        return this.#usuID;
    }

    set usuID(valor) {
        this.#usuID = valor;
    }

    get proChaveR2() {
        return this.#proChaveR2;
    }

    set proChaveR2(valor) {
        this.#proChaveR2 = valor;
    }

    get proNomeArquivo() {
        return this.#proNomeArquivo;
    }

    set proNomeArquivo(valor) {
        this.#proNomeArquivo = valor;
    }

    get proTipoArquivo() {
        return this.#proTipoArquivo;
    }

    set proTipoArquivo(valor) {
        this.#proTipoArquivo = valor;
    }

    get proTamanho() {
        return this.#proTamanho;
    }

    set proTamanho(valor) {
        this.#proTamanho = valor;
    }

    get proAtivo() {
        return this.#proAtivo;
    }

    set proAtivo(valor) {
        this.#proAtivo = valor;
    }

    get proDataCadastro() {
        return this.#proDataCadastro;
    }

    set proDataCadastro(valor) {
        this.#proDataCadastro = valor;
    }

    get proDataAtualizacao() {
        return this.#proDataAtualizacao;
    }

    set proDataAtualizacao(valor) {
        this.#proDataAtualizacao = valor;
    }

       constructor(
        proID,
        proNome,
        proCodigo,
        proDescricao,
        catID,
        usuID,
        proChaveR2,
        proNomeArquivo,
        proTipoArquivo,
        proTamanho,
        proAtivo,
        proDataCadastro,
        proDataAtualizacao
    ) {
        this.#proID = proID;
        this.#proNome = proNome;
        this.#proCodigo = proCodigo;
        this.#proDescricao = proDescricao;
        this.#catID = catID;
        this.#usuID = usuID;
        this.#proChaveR2 = proChaveR2;
        this.#proNomeArquivo = proNomeArquivo;
        this.#proTipoArquivo = proTipoArquivo;
        this.#proTamanho = proTamanho;
        this.#proAtivo = proAtivo;
        this.#proDataCadastro = proDataCadastro;
        this.#proDataAtualizacao = proDataAtualizacao;
    }

    toJSON() {
        return {
            proID: this.#proID,
            proNome: this.#proNome,
            proCodigo: this.#proCodigo,
            proDescricao: this.#proDescricao,
            catID: this.#catID,
            usuID: this.#usuID,
            proChaveR2: this.#proChaveR2,
            proNomeArquivo: this.#proNomeArquivo,
            proTipoArquivo: this.#proTipoArquivo,
            proTamanho: this.#proTamanho,
            proAtivo: this.#proAtivo,
            proDataCadastro: this.#proDataCadastro,
            proDataAtualizacao: this.#proDataAtualizacao
        };
    }

}