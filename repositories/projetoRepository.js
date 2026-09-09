import ProjetoEntity from "../entities/projetoEntity.js";
import Database from "../db/database.js";

class ProjetoRepository {

    constructor() {
        this.banco = new Database();
    }

    async cadastrar(entidade) {

        const sql = `
            INSERT INTO projeto (
                pro_nome,
                pro_codigo,
                pro_descricao,
                cat_id,
                usu_id,
                pro_chave_r2,
                pro_nome_arquivo,
                pro_tipo_arquivo,
                pro_tamanho,
                pro_ativo,
                pro_data_cadastro
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            entidade.proNome,
            entidade.proCodigo,
            entidade.proDescricao,
            entidade.catID,
            entidade.usuID,
            entidade.proChaveR2,
            entidade.proNomeArquivo,
            entidade.proTipoArquivo,
            entidade.proTamanho,
            entidade.proAtivo,
            entidade.proDataCadastro
        ];

        const id = await this.banco.ExecutaComandoLastInserted(
            sql,
            valores
        );

        entidade.proID = id;

        return entidade;
    }

    async listar() {

        const sql = `
            SELECT
                p.*,
                c.cat_nome,
                u.usu_nome
            FROM projeto p
            INNER JOIN categoria c
                ON c.cat_id = p.cat_id
            INNER JOIN usuario u
                ON u.usu_id = p.usu_id
            ORDER BY p.pro_nome
        `;

        const rows = await this.banco.ExecutaComando(sql);

        const lista = [];

        for (let row of rows) {

            const projeto = new ProjetoEntity(
                row.pro_id,
                row.pro_nome,
                row.pro_codigo,
                row.pro_descricao,
                row.cat_id,
                row.usu_id,
                row.pro_chave_r2,
                row.pro_nome_arquivo,
                row.pro_tipo_arquivo,
                row.pro_tamanho,
                row.pro_ativo,
                row.pro_data_cadastro,
                row.pro_data_atualizacao
            );

            projeto.catNome = row.cat_nome;
            projeto.usuNome = row.usu_nome;

            lista.push(projeto);
        }

        return lista;
    }

    async buscarPorId(id) {

        const sql = `
            SELECT
                p.*,
                c.cat_nome,
                u.usu_nome
            FROM projeto p
            INNER JOIN categoria c
                ON c.cat_id = p.cat_id
            INNER JOIN usuario u
                ON u.usu_id = p.usu_id
            WHERE p.pro_id = ?
            LIMIT 1
        `;

        const rows = await this.banco.ExecutaComando(
            sql,
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        const projeto = new ProjetoEntity(
            row.pro_id,
            row.pro_nome,
            row.pro_codigo,
            row.pro_descricao,
            row.cat_id,
            row.usu_id,
            row.pro_chave_r2,
            row.pro_nome_arquivo,
            row.pro_tipo_arquivo,
            row.pro_tamanho,
            row.pro_ativo,
            row.pro_data_cadastro,
            row.pro_data_atualizacao
        );

        projeto.catNome = row.cat_nome;
        projeto.usuNome = row.usu_nome;

        return projeto;
    }

    async modificar(entidade) {

        const sql = `
            UPDATE projeto
            SET
                pro_nome = ?,
                pro_codigo = ?,
                pro_descricao = ?,
                cat_id = ?,
                pro_nome_arquivo = ?,
                pro_tipo_arquivo = ?,
                pro_tamanho = ?,
                pro_chave_r2 = ?,
                pro_ativo = ?,
                pro_data_atualizacao = ?
            WHERE pro_id = ?
        `;

        const valores = [
            entidade.proNome,
            entidade.proCodigo,
            entidade.proDescricao,
            entidade.catID,
            entidade.proNomeArquivo,
            entidade.proTipoArquivo,
            entidade.proTamanho,
            entidade.proChaveR2,
            entidade.proAtivo,
            entidade.proDataAtualizacao,
            entidade.proID
        ];

        await this.banco.ExecutaComando(
            sql,
            valores
        );

        return true;
    }

    async excluir(id) {

        const sql = `
            DELETE FROM projeto
            WHERE pro_id = ?
        `;

        await this.banco.ExecutaComando(
            sql,
            [id]
        );

        return true;
    }

    async buscarPorNome(nome) {

        const sql = `
            SELECT *
            FROM projeto
            WHERE pro_nome LIKE ?
            ORDER BY pro_nome
        `;

        const rows = await this.banco.ExecutaComando(
            sql,
            [`%${nome}%`]
        );

        const lista = [];

        for (let row of rows) {

            lista.push(
                new ProjetoEntity(
                    row.pro_id,
                    row.pro_nome,
                    row.pro_codigo,
                    row.pro_descricao,
                    row.cat_id,
                    row.usu_id,
                    row.pro_chave_r2,
                    row.pro_nome_arquivo,
                    row.pro_tipo_arquivo,
                    row.pro_tamanho,
                    row.pro_ativo,
                    row.pro_data_cadastro,
                    row.pro_data_atualizacao
                )
            );
        }

        return lista;
    }
}

export default ProjetoRepository;