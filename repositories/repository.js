import Database from "../db/database.js";

export default class Repository {

    static #bancoCompartilhado;

    #banco;

    get banco(){
        return this.#banco;
    }

    constructor(){

        if(!Repository.#bancoCompartilhado){
            Repository.#bancoCompartilhado = new Database();
        }

        this.#banco = Repository.#bancoCompartilhado;
    }
}