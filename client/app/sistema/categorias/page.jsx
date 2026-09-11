"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useUsuario } from "../../context/userContext";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function CategoriasPage() {
    const { ehAdmin } = useUsuario();

    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [excluindo, setExcluindo] = useState(null);

    useEffect(() => {
        if (!ehAdmin()) {
            setCarregando(false);
            return;
        }

        carregarCategorias();
    }, [ehAdmin]);

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
                    "Erro ao carregar categorias."
                );
            }

            const dados = await response.json();

            setCategorias(
                Array.isArray(dados) ? dados : []
            );

        } catch (error) {
            console.error(
                "Erro ao carregar categorias:",
                error
            );

            setErro(
                error.message ||
                "Não foi possível carregar as categorias."
            );

        } finally {
            setCarregando(false);
        }
    }

    async function excluirCategoria(categoria) {
        const id = categoria.catID;

        const confirmar = window.confirm(
            `Tem certeza que deseja excluir a categoria "${categoria.catNome}"?\n\n` +
            "Essa ação não poderá ser desfeita."
        );

        if (!confirmar) {
            return;
        }

        try {
            setExcluindo(id);
            setErro("");

            const response = await fetch(
                `${API_URL}/categoria/excluir/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            let dados = {};

            try {
                dados = await response.json();
            } catch {
                dados = {};
            }

            if (!response.ok) {
                throw new Error(
                    dados.msg ||
                    dados.erro ||
                    "Não foi possível excluir a categoria."
                );
            }

            // Remove a categoria da tela sem precisar
            // fazer uma nova requisição.
            setCategorias((lista) =>
                lista.filter(
                    (item) =>
                        Number(item.catID) !== Number(id)
                )
            );

        } catch (error) {
            console.error(
                "Erro ao excluir categoria:",
                error
            );

            setErro(
                error.message ||
                "Não foi possível excluir a categoria."
            );

        } finally {
            setExcluindo(null);
        }
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
                    gerenciar categorias.
                </p>

                <Link
                    href="/sistema/home"
                    className="btn-sistema"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar ao dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="sistema-page">

            {/* CABEÇALHO */}
            <div className="sistema-page-header">

                <div>
                    <span className="sistema-page-kicker">
                        ADMINISTRAÇÃO
                    </span>

                    <h1>
                        Categorias
                    </h1>

                    <p>
                        Organize os tipos de equipamentos
                        e sistemas dos manuais.
                    </p>
                </div>

                <Link
                    href="/sistema/categorias/cadastrar"
                    className="btn-sistema btn-sistema-primary"
                >
                    <i className="fas fa-plus"></i>
                    Nova categoria
                </Link>

            </div>

            {/* ERRO */}
            {erro && (
                <div className="sistema-alert sistema-alert-error">
                    <i className="fas fa-exclamation-circle"></i>

                    <span>
                        {erro}
                    </span>
                </div>
            )}

            {/* CARREGANDO */}
            {carregando && (
                <div className="sistema-loading-inline">
                    <i className="fas fa-spinner fa-spin"></i>

                    <span>
                        Carregando categorias...
                    </span>
                </div>
            )}

            {/* VAZIO */}
            {!carregando &&
                !erro &&
                categorias.length === 0 && (
                    <div className="sistema-empty">

                        <div className="sistema-empty-icon">
                            <i className="fas fa-folder-open"></i>
                        </div>

                        <h2>
                            Nenhuma categoria cadastrada
                        </h2>

                        <p>
                            Cadastre a primeira categoria
                            para começar a organizar
                            os manuais.
                        </p>

                        <Link
                            href="/sistema/categorias/cadastrar"
                            className="btn-sistema btn-sistema-primary"
                        >
                            <i className="fas fa-plus"></i>
                            Cadastrar categoria
                        </Link>

                    </div>
                )}

            {/* LISTA */}
            {!carregando &&
                !erro &&
                categorias.length > 0 && (

                    <div className="categorias-grid">

                        {categorias.map((categoria) => {

                            const ativa =
                                Number(categoria.catAtivo) === 1;

                            const id =
                                categoria.catID;

                            return (
                                <div
                                    className="categoria-admin-card"
                                    key={id}
                                >

                                    {/* ÍCONE */}
                                    <div className="categoria-admin-icon">
                                        <i className="fas fa-folder"></i>
                                    </div>

                                    {/* INFORMAÇÕES */}
                                    <div className="categoria-admin-info">

                                        <div className="categoria-admin-title">

                                            <h3>
                                                {categoria.catNome}
                                            </h3>

                                            <span
                                                className={
                                                    ativa
                                                        ? "sistema-status sistema-status-success"
                                                        : "sistema-status sistema-status-inactive"
                                                }
                                            >
                                                {ativa
                                                    ? "Ativa"
                                                    : "Inativa"}
                                            </span>

                                        </div>

                                        <p>
                                            {categoria.catDescricao ||
                                                "Sem descrição."}
                                        </p>

                                    </div>

                                    {/* AÇÕES */}
                                    <div className="categoria-admin-actions">

                                        <Link
                                            href={`/sistema/categorias/alterar?id=${id}`}
                                            className="btn-sistema btn-sistema-secondary"
                                        >
                                            <i className="fas fa-edit"></i>
                                            Editar
                                        </Link>

                                        <Link
                                            href={`/sistema/manuais?categoria=${id}`}
                                            className="btn-sistema btn-sistema-secondary"
                                        >
                                            <i className="fas fa-book"></i>
                                            Manuais
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn-sistema btn-sistema-danger"
                                            onClick={() =>
                                                excluirCategoria(
                                                    categoria
                                                )
                                            }
                                            disabled={
                                                excluindo === id
                                            }
                                        >

                                            {excluindo === id ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                    Excluindo...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-trash"></i>
                                                    Excluir
                                                </>
                                            )}

                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

        </div>
    );
}