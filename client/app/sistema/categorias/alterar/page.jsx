"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { useUsuario } from "../../../context/userContext";
import ApiClient from "@/utils/apiClient";

export default function AlterarCategoriaPage() {

    return (
        <Suspense fallback={<div className="sistema-loading-inline">
            <i className="fas fa-spinner fa-spin"></i>
            Carregando...
        </div>}>
            <AlterarCategoriaConteudo />
        </Suspense>
    );
}

function AlterarCategoriaConteudo() {

    const router = useRouter();
    const params = useSearchParams();

    const { ehAdmin } = useUsuario();

    const categoriaId = params.get("id");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState(false);

    const nome = useRef(null);
    const descricao = useRef(null);
    const ativo = useRef(null);

    useEffect(() => {

        if (!categoriaId) {
            setErro(true);
            setCarregando(false);
            return;
        }

        async function carregar() {

            setCarregando(true);
            setErro(false);

            const categorias = await ApiClient.get("categoria/listar");

            const categoria = Array.isArray(categorias)
                ? categorias.find(
                    (item) => Number(item.catID) === Number(categoriaId)
                )
                : null;

            if (!categoria) {
                setErro(true);
                setCarregando(false);
                return;
            }

            nome.current.value = categoria.catNome || "";
            descricao.current.value = categoria.catDescricao || "";
            ativo.current.checked = !!categoria.catAtivo;

            setCarregando(false);
        }

        carregar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriaId]);

    if (!ehAdmin()) {

        return (
            <div className="sistema-empty">

                <div className="sistema-empty-icon">
                    <i className="fas fa-lock"></i>
                </div>

                <h2>Acesso restrito</h2>

                <p>
                    Apenas administradores podem
                    alterar categorias.
                </p>

                <Link href="/sistema/home" className="btn-sistema">
                    <i className="fas fa-arrow-left"></i>
                    Voltar ao dashboard
                </Link>

            </div>
        );
    }

    async function salvar(e) {

        e.preventDefault();

        const catNome = nome.current.value.trim();

        if (!catNome) {
            toast.error("O nome da categoria é obrigatório.");
            return;
        }

        setSalvando(true);

        const resposta = await ApiClient.put(
            `categoria/modificar/${categoriaId}`,
            {
                catNome,
                catDescricao: descricao.current.value.trim(),
                catAtivo: ativo.current.checked
            }
        );

        setSalvando(false);

        if (resposta) {
            toast.success(resposta.msg || "Categoria atualizada com sucesso!");
            router.push("/sistema/categorias");
        }
    }

    async function excluir() {

        const confirmar = confirm(
            "Deseja realmente excluir esta categoria? Os manuais vinculados a ela deixarão de ser encontrados."
        );

        if (!confirmar) {
            return;
        }

        setExcluindo(true);

        const resposta = await ApiClient.delete(
            `categoria/excluir/${categoriaId}`
        );

        setExcluindo(false);

        if (resposta) {
            toast.success(resposta.msg || "Categoria excluída com sucesso!");
            router.push("/sistema/categorias");
        }
    }

    return (
        <div className="sistema-page">

            <div className="sistema-page-header">

                <div>
                    <span className="sistema-page-kicker">
                        ADMINISTRAÇÃO
                    </span>

                    <h1>Alterar categoria</h1>

                    <p>Atualize as informações desta categoria.</p>
                </div>

                <Link href="/sistema/categorias" className="btn-sistema-secondary">
                    <i className="fas fa-arrow-left"></i>
                    Voltar
                </Link>

            </div>

            {carregando && (
                <div className="sistema-loading-inline">
                    <i className="fas fa-spinner fa-spin"></i>
                    Carregando categoria...
                </div>
            )}

            {!carregando && erro && (
                <div className="sistema-alert sistema-alert-error">
                    <i className="fas fa-triangle-exclamation"></i>
                    Categoria não encontrada.
                </div>
            )}

            {!carregando && !erro && (

                <form className="sistema-form-card" onSubmit={salvar}>

                    <div className="sistema-form-row">
                        <div className="sistema-form-group">
                            <label htmlFor="catNome">Nome da categoria</label>
                            <input
                                id="catNome"
                                ref={nome}
                                type="text"
                                maxLength={120}
                            />
                        </div>
                    </div>

                    <div className="sistema-form-row">
                        <div className="sistema-form-group">
                            <label htmlFor="catDescricao">Descrição</label>
                            <textarea
                                id="catDescricao"
                                ref={descricao}
                                maxLength={255}
                            />
                        </div>
                    </div>

                    <div className="sistema-form-check">
                        <input id="catAtivo" ref={ativo} type="checkbox" />
                        <label htmlFor="catAtivo">
                            Categoria ativa (visível para os clientes)
                        </label>
                    </div>

                    <div className="sistema-form-actions">

                        <button type="submit" className="btn-sistema" disabled={salvando}>
                            {salvando ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check"></i>
                                    Salvar alterações
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            className="btn-sistema-secondary btn-sistema-danger"
                            onClick={excluir}
                            disabled={excluindo}
                        >
                            {excluindo ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Excluindo...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-trash"></i>
                                    Excluir categoria
                                </>
                            )}
                        </button>

                        <Link href="/sistema/categorias" className="btn-sistema-secondary">
                            Cancelar
                        </Link>

                    </div>

                </form>
            )}

        </div>
    );
}
