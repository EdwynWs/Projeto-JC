"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUsuario } from "../../context/userContext";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001";

export default function CategoriasPage() {

    const { ehAdmin } = useUsuario();

    const [categorias, setCategorias] =
        useState([]);

    const [carregando, setCarregando] =
        useState(true);

    const [erro, setErro] =
        useState(false);

    useEffect(() => {

        if (!ehAdmin()) {
            setCarregando(false);
            return;
        }

        async function carregarCategorias() {

            try {

                setCarregando(true);
                setErro(false);

                const response = await fetch(
                    `${API_URL}/categoria/listar`,
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Erro ao carregar categorias."
                    );
                }

                const dados =
                    await response.json();

                setCategorias(
                    Array.isArray(dados)
                        ? dados.filter(
                            categoria =>
                                Number(categoria.catAtivo) === 1
                            )
                        : []
                );

            } catch (error) {

                console.error(error);
                setErro(true);

            } finally {

                setCarregando(false);

            }
        }

        carregarCategorias();

    }, [ehAdmin]);

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
                    className="btn-sistema"
                >
                    <i className="fas fa-plus"></i>
                    Nova categoria
                </Link>

            </div>

            {carregando && (
                <div className="sistema-loading-inline">
                    <i className="fas fa-spinner fa-spin"></i>
                    Carregando categorias...
                </div>
            )}

            {erro && (
                <div className="sistema-alert sistema-alert-error">
                    <i className="fas fa-exclamation-circle"></i>

                    Não foi possível carregar
                    as categorias.
                </div>
            )}

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

                    </div>
                )}

            {!carregando &&
                !erro &&
                categorias.length > 0 && (

                    <div className="categorias-grid">

                        {categorias.map((categoria) => (

                            <div
                                className="categoria-admin-card"
                                key={categoria.catID}
                            >

                                <div className="categoria-admin-icon">
                                    <i className="fas fa-folder"></i>
                                </div>

                                <div className="categoria-admin-info">

                                    <h3>
                                        {categoria.catNome}
                                    </h3>

                                    <p>
                                        {categoria.catDescricao ||
                                            "Sem descrição."}
                                    </p>

                                </div>

                                <div className="categoria-admin-actions">

                                    <Link
                                        href={`/sistema/categorias/alterar?id=${categoria.catID}`}
                                        className="btn-sistema-secondary"
                                    >
                                        <i className="fas fa-edit"></i>
                                        Alterar
                                    </Link>

                                    <Link
                                        href={`/sistema/manuais?categoria=${categoria.catID}`}
                                        className="btn-sistema-secondary"
                                    >
                                        <i className="fas fa-book"></i>
                                        Manuais
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

        </div>
    );
}