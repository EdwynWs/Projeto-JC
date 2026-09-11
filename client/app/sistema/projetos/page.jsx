"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useUsuario } from "../../context/userContext";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";


export default function ProjetosPage() {

    const { usuario, ehAdmin } = useUsuario();

    const [projetos, setProjetos] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");


    useEffect(() => {

        if (!usuario) return;

        if (!ehAdmin()) {

            setCarregando(false);

            return;

        }

        carregarProjetos();

    }, [usuario]);


    async function carregarProjetos() {

        try {

            setCarregando(true);
            setErro("");

            const response = await fetch(
                `${API_URL}/projeto/listar`,
                {
                    credentials: "include"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Não foi possível carregar os projetos."
                );

            }


            const dados =
                await response.json();


            setProjetos(
                Array.isArray(dados)
                    ? dados.filter(
                        projeto =>
                            Number(projeto.proAtivo) === 1
                    )
                    : []
            );


        } catch (error) {

            console.error(error);

            setErro(
                error.message ||
                "Erro ao carregar projetos."
            );

        } finally {

            setCarregando(false);

        }

    }


    async function abrirProjeto(
        projeto,
        baixar = false
    ) {

        try {

            const url =
                `${API_URL}/projeto/${projeto.proID}/arquivo` +
                (baixar ? "?download=1" : "");


            const response =
                await fetch(
                    url,
                    {
                        credentials: "include"
                    }
                );


            const dados =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    dados.msg ||
                    "Não foi possível acessar o projeto."
                );

            }


            window.open(
                dados.url,
                "_blank",
                "noopener,noreferrer"
            );


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Erro ao abrir o projeto."
            );

        }

    }


    async function excluirProjeto(projeto) {

        const confirmar =
            window.confirm(
                `Tem certeza que deseja excluir o projeto "${projeto.proNome}"?`
            );


        if (!confirmar) return;


        try {

            const response =
                await fetch(
                    `${API_URL}/projeto/excluir/${projeto.proID}`,
                    {
                        method: "DELETE",
                        credentials: "include"
                    }
                );


            const dados =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    dados.msg ||
                    "Não foi possível excluir o projeto."
                );

            }


            setProjetos(lista =>
                lista.filter(
                    item =>
                        Number(item.proID) !==
                        Number(projeto.proID)
                )
            );


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Erro ao excluir projeto."
            );

        }

    }


    if (!usuario || carregando) {

        return (
            <div className="sistema-loading-inline">

                <i className="fas fa-spinner fa-spin"></i>

                <span>
                    Carregando projetos...
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
                    acessar os projetos elétricos.
                </p>

                <Link
                    href="/sistema/home"
                    className="btn-sistema"
                >
                    Voltar
                </Link>

            </div>
        );

    }


    return (
        <div className="sistema-page">

            <div className="sistema-page-header">

                <div>

                    <span className="sistema-page-kicker">
                        ADMINISTRAÇÃO
                    </span>

                    <h1>
                        Projetos Elétricos
                    </h1>

                    <p>
                        Gerencie os projetos elétricos
                        da JCortiça Painéis Elétricos.
                    </p>

                </div>


                <Link
                    href="/sistema/projetos/cadastrar"
                    className="btn-sistema"
                >

                    <i className="fas fa-plus"></i>

                    Novo projeto

                </Link>

            </div>


            {erro && (

                <div className="sistema-alert">

                    <i className="fas fa-circle-exclamation"></i>

                    {erro}

                </div>

            )}


            {projetos.length === 0 && !erro ? (

                <div className="sistema-empty">

                    <div className="sistema-empty-icon">

                        <i className="fas fa-bolt"></i>

                    </div>

                    <h2>
                        Nenhum projeto cadastrado
                    </h2>

                    <p>
                        Cadastre o primeiro projeto
                        elétrico da JCortiça.
                    </p>

                    <Link
                        href="/sistema/projetos/cadastrar"
                        className="btn-sistema"
                    >

                        <i className="fas fa-plus"></i>

                        Cadastrar projeto

                    </Link>

                </div>

            ) : (

                <div className="projetos-grid">

                    {projetos.map(
                        projeto => (

                            <div
                                key={projeto.proID}
                                className="projeto-card"
                            >

                                <div className="projeto-card-icon">

                                    <i className="fas fa-file-pdf"></i>

                                </div>


                                <div className="projeto-card-content">

                                    <h3>
                                        {projeto.proNome}
                                    </h3>

                                    {projeto.proCodigo && (

                                        <span>
                                            Código:{" "}
                                            {projeto.proCodigo}
                                        </span>

                                    )}


                                    {projeto.catNome && (

                                        <span>
                                            Categoria:{" "}
                                            {projeto.catNome}
                                        </span>

                                    )}


                                    {projeto.proNomeArquivo && (

                                        <small>
                                            {projeto.proNomeArquivo}
                                        </small>

                                    )}

                                </div>


                                <div className="projeto-card-actions">

                                    <button
                                        type="button"
                                        className="btn-sistema"
                                        onClick={() =>
                                            abrirProjeto(
                                                projeto,
                                                false
                                            )
                                        }
                                    >

                                        <i className="fas fa-eye"></i>

                                        Visualizar

                                    </button>


                                    <button
                                        type="button"
                                        className="btn-sistema-secondary"
                                        onClick={() =>
                                            abrirProjeto(
                                                projeto,
                                                true
                                            )
                                        }
                                    >

                                        <i className="fas fa-download"></i>

                                        Baixar

                                    </button>


                                    <button
                                        type="button"
                                        className="btn-sistema-danger"
                                        onClick={() =>
                                            excluirProjeto(
                                                projeto
                                            )
                                        }
                                    >

                                        <i className="fas fa-trash"></i>

                                        Excluir

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );

}