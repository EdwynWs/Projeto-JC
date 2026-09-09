"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUsuario } from "../../../context/userContext";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function CadastrarProjetoPage() {

    const router = useRouter();

    const {
        usuario,
        ehAdmin
    } = useUsuario();

    const [categorias, setCategorias] = useState([]);

    const [formulario, setFormulario] = useState({
        proNome: "",
        proCodigo: "",
        proDescricao: "",
        catID: ""
    });

    const [arquivo, setArquivo] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {

        if (!usuario) return;

        if (!ehAdmin()) {
            setCarregando(false);
            return;
        }

        carregarCategorias();

    }, [usuario]);

    async function carregarCategorias() {

        try {

            setCarregando(true);
            setErro("");

            const response = await fetch(
                `${API_URL}/categoria/listar`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Não foi possível carregar as categorias."
                );
            }

            const dados = await response.json();

            const categoriasAtivas = Array.isArray(dados)
                ? dados.filter(
                    categoria =>
                        Number(categoria.catAtivo) === 1
                )
                : [];

            setCategorias(categoriasAtivas);

        } catch (error) {

            console.error(error);

            setErro(
                "Não foi possível carregar as categorias."
            );

        } finally {

            setCarregando(false);

        }
    }

    function alterarCampo(event) {

        const {
            name,
            value
        } = event.target;

        setFormulario(prev => ({
            ...prev,
            [name]: value
        }));

        setErro("");
        setSucesso("");
    }

    function selecionarArquivo(event) {

        const selecionado =
            event.target.files?.[0];

        if (!selecionado) {
            return;
        }

        setErro("");

        if (
            selecionado.type !==
            "application/pdf"
        ) {

            setErro(
                "Selecione apenas arquivos PDF."
            );

            event.target.value = "";
            setArquivo(null);

            return;
        }

        const tamanhoMaximo =
            20 * 1024 * 1024;

        if (
            selecionado.size >
            tamanhoMaximo
        ) {

            setErro(
                "O arquivo deve possuir no máximo 20 MB."
            );

            event.target.value = "";
            setArquivo(null);

            return;
        }

        setArquivo(selecionado);
    }

    function removerArquivo() {

        setArquivo(null);

        const input =
            document.getElementById("arquivo");

        if (input) {
            input.value = "";
        }
    }

    function formatarTamanho(bytes) {

        if (!bytes) return "0 KB";

        if (bytes < 1024 * 1024) {
            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;
        }

        return `${(
            bytes / (1024 * 1024)
        ).toFixed(2)} MB`;
    }

    async function cadastrarProjeto(event) {

        event.preventDefault();

        setErro("");
        setSucesso("");

        if (!formulario.proNome.trim()) {
            setErro(
                "Informe o nome do projeto."
            );
            return;
        }

        if (!formulario.catID) {
            setErro(
                "Selecione uma categoria."
            );
            return;
        }

        if (!arquivo) {
            setErro(
                "Selecione o arquivo PDF do projeto."
            );
            return;
        }

        try {

            setSalvando(true);

            const dados =
                new FormData();

            dados.append(
                "proNome",
                formulario.proNome.trim()
            );

            dados.append(
                "proCodigo",
                formulario.proCodigo.trim()
            );

            dados.append(
                "proDescricao",
                formulario.proDescricao.trim()
            );

            dados.append(
                "catID",
                formulario.catID
            );

            dados.append(
                "arquivo",
                arquivo
            );

            const response = await fetch(
                `${API_URL}/projeto/cadastrar`,
                {
                    method: "POST",
                    credentials: "include",
                    body: dados
                }
            );

            const resultado =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    resultado.msg ||
                    "Não foi possível cadastrar o projeto."
                );
            }

            setSucesso(
                "Projeto cadastrado com sucesso!"
            );

            setTimeout(() => {
                router.push("/sistema/projetos");
            }, 1000);

        } catch (error) {

            console.error(error);

            setErro(
                error.message ||
                "Erro ao cadastrar projeto."
            );

        } finally {

            setSalvando(false);

        }
    }

    if (!usuario || carregando) {

        return (
            <div className="sistema-loading-inline">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Carregando...</span>
            </div>
        );
    }

    if (!ehAdmin()) {

        return (
            <div className="sistema-empty">

                <div className="sistema-empty-icon">
                    <i className="fas fa-lock"></i>
                </div>

                <h2>Acesso restrito</h2>

                <p>
                    Apenas administradores podem
                    cadastrar projetos elétricos.
                </p>

                <Link
                    href="/sistema/projetos"
                    className="btn-sistema"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar aos projetos
                </Link>

            </div>
        );
    }

    return (

        <div className="cadastro-page">

            <div className="cadastro-header">

                <div>

                    <span className="sistema-page-kicker">
                        ADMINISTRAÇÃO
                    </span>

                    <h1>
                        Cadastrar projeto elétrico
                    </h1>

                    <p>
                        Adicione um novo projeto
                        elétrico da JCortiça.
                    </p>

                </div>

                <Link
                    href="/sistema/projetos"
                    className="btn-sistema-secondary"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar
                </Link>

            </div>

            {erro && (
                <div className="cadastro-alert cadastro-alert-error">
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{erro}</span>
                </div>
            )}

            {sucesso && (
                <div className="cadastro-alert cadastro-alert-success">
                    <i className="fas fa-circle-check"></i>
                    <span>{sucesso}</span>
                </div>
            )}

            <form
                className="cadastro-card"
                onSubmit={cadastrarProjeto}
            >

                <div className="cadastro-section">

                    <div className="cadastro-section-title">

                        <div className="cadastro-section-icon">
                            <i className="fas fa-drafting-compass"></i>
                        </div>

                        <div>
                            <h2>Informações do projeto</h2>

                            <p>
                                Informe os dados de
                                identificação do projeto.
                            </p>
                        </div>

                    </div>

                    <div className="cadastro-grid">

                        <div className="cadastro-field cadastro-field-full">

                            <label htmlFor="proNome">
                                Nome do projeto
                                <span>*</span>
                            </label>

                            <input
                                id="proNome"
                                name="proNome"
                                type="text"
                                value={formulario.proNome}
                                onChange={alterarCampo}
                                placeholder="Ex.: Projeto Painel de Abastecimento"
                                maxLength={200}
                            />

                        </div>

                        <div className="cadastro-field">

                            <label htmlFor="proCodigo">
                                Código do projeto
                            </label>

                            <input
                                id="proCodigo"
                                name="proCodigo"
                                type="text"
                                value={formulario.proCodigo}
                                onChange={alterarCampo}
                                placeholder="Ex.: PROJ-001"
                                maxLength={100}
                            />

                        </div>

                        <div className="cadastro-field">

                            <label htmlFor="catID">
                                Categoria
                                <span>*</span>
                            </label>

                            <div className="cadastro-select-wrapper">

                                <select
                                    id="catID"
                                    name="catID"
                                    value={formulario.catID}
                                    onChange={alterarCampo}
                                >

                                    <option value="">
                                        Selecione uma categoria
                                    </option>

                                    {categorias.map(
                                        categoria => (
                                            <option
                                                key={categoria.catID}
                                                value={categoria.catID}
                                            >
                                                {categoria.catNome}
                                            </option>
                                        )
                                    )}

                                </select>

                                <i className="fas fa-chevron-down"></i>

                            </div>

                        </div>

                        <div className="cadastro-field cadastro-field-full">

                            <label htmlFor="proDescricao">
                                Descrição
                            </label>

                            <textarea
                                id="proDescricao"
                                name="proDescricao"
                                value={formulario.proDescricao}
                                onChange={alterarCampo}
                                placeholder="Descreva brevemente o projeto elétrico..."
                                rows={5}
                            />

                        </div>

                    </div>

                </div>

                <div className="cadastro-section">

                    <div className="cadastro-section-title">

                        <div className="cadastro-section-icon">
                            <i className="fas fa-file-pdf"></i>
                        </div>

                        <div>

                            <h2>
                                Arquivo do projeto
                            </h2>

                            <p>
                                Envie o PDF que será
                                armazenado no Cloudflare R2.
                            </p>

                        </div>

                    </div>

                    <div className="arquivo-upload">

                        {!arquivo ? (

                            <label
                                htmlFor="arquivo"
                                className="arquivo-dropzone"
                            >

                                <div className="arquivo-upload-icon">
                                    <i className="fas fa-cloud-arrow-up"></i>
                                </div>

                                <strong>
                                    Selecione o arquivo PDF
                                </strong>

                                <span>
                                    Clique aqui para
                                    procurar no computador
                                </span>

                                <small>
                                    PDF • máximo 20 MB
                                </small>

                            </label>

                        ) : (

                            <div className="arquivo-selecionado">

                                <div className="arquivo-selecionado-icon">
                                    <i className="fas fa-file-pdf"></i>
                                </div>

                                <div className="arquivo-selecionado-info">

                                    <strong>
                                        {arquivo.name}
                                    </strong>

                                    <span>
                                        {formatarTamanho(
                                            arquivo.size
                                        )}
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    className="arquivo-remover"
                                    onClick={removerArquivo}
                                    title="Remover arquivo"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>

                            </div>

                        )}

                        <input
                            id="arquivo"
                            name="arquivo"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={selecionarArquivo}
                            hidden
                        />

                    </div>

                </div>

                <div className="cadastro-actions">

                    <Link
                        href="/sistema/projetos"
                        className="btn-sistema-secondary"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        className="btn-sistema"
                        disabled={salvando}
                    >

                        {salvando ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-cloud-upload-alt"></i>
                                Cadastrar projeto
                            </>
                        )}

                    </button>

                </div>

            </form>

        </div>
    );
}