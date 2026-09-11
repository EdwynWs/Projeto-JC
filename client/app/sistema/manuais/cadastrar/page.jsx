"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUsuario } from "../../../context/userContext";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const VOLTAGENS = [
    {
        id: "MONOFASICO",
        nome: "Monofásico",
        icone: "fa-house"
    },
    {
        id: "220V",
        nome: "220V",
        icone: "fa-bolt"
    },
    {
        id: "380V",
        nome: "380V",
        icone: "fa-bolt"
    }
];

export default function CadastrarManualPage() {

    const router = useRouter();

    const {
        usuario,
        ehAdmin
    } = useUsuario();

    const [categorias, setCategorias] = useState([]);

    const [formulario, setFormulario] = useState({
        manNome: "",
        manVoltagem: "",
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
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Não foi possível carregar as categorias."
                );
            }

            const dados = await response.json();

            const categoriasAtivas =
                Array.isArray(dados)
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

        const arquivoSelecionado =
            event.target.files?.[0];

        if (!arquivoSelecionado) {
            setArquivo(null);
            return;
        }

        if (
            arquivoSelecionado.type !==
            "application/pdf"
        ) {

            setErro(
                "Apenas arquivos PDF são permitidos."
            );

            event.target.value = "";
            setArquivo(null);

            return;

        }

        if (
            arquivoSelecionado.size >
            20 * 1024 * 1024
        ) {

            setErro(
                "O arquivo deve ter no máximo 20 MB."
            );

            event.target.value = "";
            setArquivo(null);

            return;

        }

        setArquivo(arquivoSelecionado);
        setErro("");
        setSucesso("");

    }


    async function cadastrarManual(event) {

        event.preventDefault();

        setErro("");
        setSucesso("");

        if (!formulario.manNome.trim()) {

            setErro(
                "Informe o nome do manual."
            );

            return;

        }

        if (!formulario.manVoltagem) {

            setErro(
                "Selecione a tensão do manual."
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
                "Selecione o arquivo PDF do manual."
            );

            return;

        }


        try {

            setSalvando(true);

            const dadosFormulario =
                new FormData();

            dadosFormulario.append(
                "manNome",
                formulario.manNome.trim()
            );

            dadosFormulario.append(
                "manVoltagem",
                formulario.manVoltagem
            );

            dadosFormulario.append(
                "catID",
                Number(formulario.catID)
            );

            dadosFormulario.append(
                "arquivo",
                arquivo
            );


            const response = await fetch(
                `${API_URL}/manual/cadastrar`,
                {
                    method: "POST",
                    credentials: "include",
                    body: dadosFormulario
                }
            );


            const dados =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    dados.msg ||
                    "Não foi possível cadastrar o manual."
                );

            }


            setSucesso(
                "Manual cadastrado com sucesso!"
            );


            const categoriaSelecionada =
                formulario.catID;


            setTimeout(() => {

                router.push(
                    `/sistema/manuais?categoria=${categoriaSelecionada}`
                );

            }, 700);


        } catch (error) {

            console.error(error);

            setErro(
                error.message ||
                "Erro ao cadastrar manual."
            );

        } finally {

            setSalvando(false);

        }

    }


    if (!usuario || carregando) {

        return (
            <div className="sistema-loading-inline">

                <i className="fas fa-spinner fa-spin"></i>

                <span>
                    Carregando...
                </span>

            </div>
        );

    }


    if (!ehAdmin()) {

        return (
            <div className="sistema-empty">

                <div className="sistema-empty-icon">
                    <i className="fas fa-lock"></i>
                </div>

                <h2>
                    Acesso restrito
                </h2>

                <p>
                    Apenas administradores podem
                    cadastrar manuais.
                </p>

                <Link
                    href="/sistema/home"
                    className="btn-sistema"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar
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
                        Cadastrar manual
                    </h1>

                    <p>
                        Adicione um novo manual ao
                        sistema da JCortiça.
                    </p>

                </div>

                <Link
                    href="/sistema/manuais"
                    className="btn-sistema-secondary"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar
                </Link>

            </div>


            {erro && (

                <div className="cadastro-alert cadastro-alert-error">

                    <i className="fas fa-circle-exclamation"></i>

                    <span>
                        {erro}
                    </span>

                </div>

            )}


            {sucesso && (

                <div className="cadastro-alert cadastro-alert-success">

                    <i className="fas fa-circle-check"></i>

                    <span>
                        {sucesso}
                    </span>

                </div>

            )}


            <form
                className="cadastro-card"
                onSubmit={cadastrarManual}
            >

                <div className="cadastro-section">

                    <div className="cadastro-section-title">

                        <div className="cadastro-section-icon">
                            <i className="fas fa-book"></i>
                        </div>

                        <div>

                            <h2>
                                Informações do manual
                            </h2>

                            <p>
                                Preencha os dados do documento.
                            </p>

                        </div>

                    </div>


                    <div className="cadastro-grid">

                        <div className="cadastro-field cadastro-field-full">

                            <label htmlFor="manNome">
                                Nome do manual
                                <span>*</span>
                            </label>

                            <input
                                id="manNome"
                                name="manNome"
                                type="text"
                                value={formulario.manNome}
                                onChange={alterarCampo}
                                placeholder="Ex.: Manual do Painel de Controle"
                                maxLength={200}
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


                        <div className="cadastro-field">

                            <label>
                                Tensão
                                <span>*</span>
                            </label>

                            <div className="voltagem-options">

                                {VOLTAGENS.map(
                                    voltagem => (

                                        <label
                                            key={voltagem.id}
                                            className={
                                                `voltagem-option ${
                                                    formulario.manVoltagem ===
                                                    voltagem.id
                                                        ? "selected"
                                                        : ""
                                                }`
                                            }
                                        >

                                            <input
                                                type="radio"
                                                name="manVoltagem"
                                                value={voltagem.id}
                                                checked={
                                                    formulario.manVoltagem ===
                                                    voltagem.id
                                                }
                                                onChange={
                                                    alterarCampo
                                                }
                                            />

                                            <span className="voltagem-option-icon">

                                                <i
                                                    className={
                                                        `fas ${voltagem.icone}`
                                                    }
                                                ></i>

                                            </span>

                                            <span>
                                                {voltagem.nome}
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>

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
                                Arquivo PDF
                            </h2>

                            <p>
                                Selecione o manual que será
                                armazenado no Backblaze.
                            </p>

                        </div>

                    </div>


                    <div className="cadastro-field cadastro-field-full">

                        <label htmlFor="arquivo">
                            Arquivo PDF
                            <span>*</span>
                        </label>

                        <input
                            id="arquivo"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={selecionarArquivo}
                        />

                        <small>
                            PDF de até 20 MB.
                        </small>

                        {arquivo && (

                            <div className="arquivo-selecionado">

                                <i className="fas fa-file-pdf"></i>

                                <span>
                                    {arquivo.name}
                                </span>

                            </div>

                        )}

                    </div>

                </div>


                <div className="cadastro-actions">

                    <Link
                        href="/sistema/manuais"
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
                                Cadastrando...
                            </>

                        ) : (

                            <>
                                <i className="fas fa-save"></i>
                                Cadastrar manual
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>
    );

}