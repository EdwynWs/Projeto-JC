"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useUsuario } from "../../../context/userContext";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AlterarCategoriaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { usuario, carregando: carregandoUsuario, ehAdmin } = useUsuario();

    const [catNome, setCatNome] = useState("");
    const [catDescricao, setCatDescricao] = useState("");
    const [catAtivo, setCatAtivo] = useState(true);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const id = searchParams.get("id");

    useEffect(() => {
        if (carregandoUsuario) return;

        if (!usuario) return;

        if (!ehAdmin()) {
            router.replace("/sistema/home");
            return;
        }

        if (!id) {
            setErro("ID da categoria não informado.");
            setCarregando(false);
            return;
        }

        carregarCategoria();
    }, [id, usuario, carregandoUsuario]);

    async function carregarCategoria() {
        try {
            setCarregando(true);
            setErro("");

            const response = await fetch(
                `${API_URL}/categoria/listar`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Não foi possível carregar as categorias."
                );
            }

            const categorias = await response.json();

            const categoria = categorias.find(
                (item) =>
                    Number(item.catID ?? item.cat_id) === Number(id)
            );

            if (!categoria) {
                throw new Error(
                    "Categoria não encontrada."
                );
            }

            setCatNome(
                categoria.catNome ??
                categoria.cat_nome ??
                ""
            );

            setCatDescricao(
                categoria.catDescricao ??
                categoria.cat_descricao ??
                ""
            );

            setCatAtivo(
                Number(
                    categoria.catAtivo ??
                    categoria.cat_ativo
                ) === 1
            );
        } catch (error) {
            console.error(
                "Erro ao carregar categoria:",
                error
            );

            setErro(
                error.message ||
                "Erro ao carregar categoria."
            );
        } finally {
            setCarregando(false);
        }
    }

    async function salvar(e) {
        e.preventDefault();

        setErro("");
        setSucesso("");

        if (!catNome.trim()) {
            setErro("Informe o nome da categoria.");
            return;
        }

        try {
            setSalvando(true);

            const response = await fetch(
                `${API_URL}/categoria/modificar/${id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        catNome: catNome.trim(),
                        catDescricao: catDescricao.trim(),
                        catAtivo: catAtivo ? 1 : 0,
                    }),
                }
            );

            const dados = await response.json();

            if (!response.ok) {
                throw new Error(
                    dados.msg ||
                    dados.erro ||
                    "Não foi possível alterar a categoria."
                );
            }

            setSucesso(
                "Categoria alterada com sucesso!"
            );

            setTimeout(() => {
                router.push("/sistema/categorias");
            }, 800);
        } catch (error) {
            console.error(
                "Erro ao alterar categoria:",
                error
            );

            setErro(
                error.message ||
                "Erro ao alterar categoria."
            );
        } finally {
            setSalvando(false);
        }
    }

    if (carregandoUsuario || carregando) {
        return (
            <div className="sistema-loading-inline">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Carregando categoria...</span>
            </div>
        );
    }

    if (!usuario || !ehAdmin()) {
        return null;
    }

    return (
        <div className="sistema-page">

            <div className="sistema-page-header">
                <div>
                    <span className="sistema-page-kicker">
                        Administração
                    </span>

                    <h1>
                        Alterar categoria
                    </h1>

                    <p>
                        Atualize as informações da categoria.
                    </p>
                </div>

                <Link
                    href="/sistema/categorias"
                    className="btn-sistema btn-sistema-secondary"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar
                </Link>
            </div>

            {erro && (
                <div className="sistema-alert sistema-alert-error">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{erro}</span>
                </div>
            )}

            {sucesso && (
                <div className="sistema-alert sistema-alert-success">
                    <i className="fas fa-check-circle"></i>
                    <span>{sucesso}</span>
                </div>
            )}

            <form
                className="cadastro-form"
                onSubmit={salvar}
            >

                <div className="cadastro-card">

                    <div className="cadastro-card-header">
                        <div className="cadastro-card-icon">
                            <i className="fas fa-folder"></i>
                        </div>

                        <div>
                            <h2>
                                Dados da categoria
                            </h2>

                            <p>
                                Preencha as informações abaixo.
                            </p>
                        </div>
                    </div>

                    <div className="cadastro-card-body">

                        <div className="cadastro-form-group">
                            <label htmlFor="catNome">
                                Nome da categoria
                                <span>*</span>
                            </label>

                            <input
                                id="catNome"
                                type="text"
                                value={catNome}
                                onChange={(e) =>
                                    setCatNome(e.target.value)
                                }
                                placeholder="Ex.: Aviário"
                                maxLength={200}
                                disabled={salvando}
                            />
                        </div>

                        <div className="cadastro-form-group">
                            <label htmlFor="catDescricao">
                                Descrição
                            </label>

                            <textarea
                                id="catDescricao"
                                value={catDescricao}
                                onChange={(e) =>
                                    setCatDescricao(e.target.value)
                                }
                                placeholder="Descreva a categoria..."
                                rows={5}
                                disabled={salvando}
                            />
                        </div>

                        <div className="cadastro-form-group">
                            <label>
                                Status
                            </label>

                            <div className="cadastro-switch">

                                <label className="cadastro-switch-label">

                                    <input
                                        type="checkbox"
                                        checked={catAtivo}
                                        onChange={(e) =>
                                            setCatAtivo(
                                                e.target.checked
                                            )
                                        }
                                        disabled={salvando}
                                    />

                                    <span className="cadastro-switch-slider"></span>

                                    <span>
                                        {catAtivo
                                            ? "Categoria ativa"
                                            : "Categoria inativa"}
                                    </span>

                                </label>

                            </div>
                        </div>

                    </div>

                    <div className="cadastro-card-footer">

                        <Link
                            href="/sistema/categorias"
                            className="btn-sistema btn-sistema-secondary"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="btn-sistema btn-sistema-primary"
                            disabled={salvando}
                        >
                            {salvando ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    Salvar alterações
                                </>
                            )}
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );
}