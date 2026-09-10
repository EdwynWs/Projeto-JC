"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { useUsuario } from "../../../context/userContext";
import ApiClient from "@/utils/apiClient";

const VOLTAGENS = ["Monofásico", "220V", "380V"];

export default function AlterarManualPage() {

    return (
        <Suspense fallback={<div className="sistema-loading-inline">
            <i className="fas fa-spinner fa-spin"></i>
            Carregando...
        </div>}>
            <AlterarManualConteudo />
        </Suspense>
    );
}

function AlterarManualConteudo() {

    const router = useRouter();
    const params = useSearchParams();

    const { ehAdmin } = useUsuario();

    const manualId = params.get("id");

    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState(false);
    const [catIDOriginal, setCatIDOriginal] = useState(null);

    const nome = useRef(null);
    const voltagem = useRef(null);
    const categoria = useRef(null);
    const chaveR2 = useRef(null);
    const ativo = useRef(null);

    useEffect(() => {

        if (!manualId) {
            setErro(true);
            setCarregando(false);
            return;
        }

        async function carregar() {

            setCarregando(true);
            setErro(false);

            const [categoriasResp, manuaisResp] = await Promise.all([
                ApiClient.get("categoria/listar"),
                ApiClient.get("manual/listar")
            ]);

            const listaCategorias = Array.isArray(categoriasResp) ? categoriasResp : [];
            setCategorias(listaCategorias);

            const listaManuais = Array.isArray(manuaisResp) ? manuaisResp : [];

            const manual = listaManuais.find(
                (item) => Number(item.manID) === Number(manualId)
            );

            if (!manual) {
                setErro(true);
                setCarregando(false);
                return;
            }

            nome.current.value = manual.manNome || "";
            voltagem.current.value = manual.manVoltagem || VOLTAGENS[0];
            categoria.current.value = manual.catID || "";
            chaveR2.current.value = manual.manChaveR2 || "";
            ativo.current.checked = !!manual.manAtivo;

            setCatIDOriginal(manual.catID);
            setCarregando(false);
        }

        carregar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manualId]);

    if (!ehAdmin()) {

        return (
            <div className="sistema-empty">

                <div className="sistema-empty-icon">
                    <i className="fas fa-lock"></i>
                </div>

                <h2>Acesso restrito</h2>

                <p>
                    Apenas administradores podem
                    alterar manuais.
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

        const manNome = nome.current.value.trim();
        const manVoltagem = voltagem.current.value;
        const catID = categoria.current.value;
        const manChaveR2 = chaveR2.current.value.trim();

        if (!manNome) {
            toast.error("O nome do manual é obrigatório.");
            return;
        }

        if (!catID) {
            toast.error("Selecione a categoria do manual.");
            return;
        }

        if (!manChaveR2) {
            toast.error("Informe a chave (caminho) do arquivo no R2.");
            return;
        }

        setSalvando(true);

        const resposta = await ApiClient.put(
            `manual/modificar/${manualId}`,
            {
                manNome,
                manVoltagem,
                catID: Number(catID),
                manChaveR2,
                manAtivo: ativo.current.checked
            }
        );

        setSalvando(false);

        if (resposta) {
            toast.success(resposta.msg || "Manual atualizado com sucesso!");
            router.push(`/sistema/manuais?categoria=${catID}`);
        }
    }

    async function excluir() {

        const confirmar = confirm(
            "Deseja realmente excluir este manual?"
        );

        if (!confirmar) {
            return;
        }

        setExcluindo(true);

        const resposta = await ApiClient.delete(`manual/excluir/${manualId}`);

        setExcluindo(false);

        if (resposta) {
            toast.success(resposta.msg || "Manual excluído com sucesso!");
            router.push(
                catIDOriginal
                    ? `/sistema/manuais?categoria=${catIDOriginal}`
                    : "/sistema/categorias"
            );
        }
    }

    return (
        <div className="sistema-page">

            <div className="sistema-page-header">

                <div>
                    <span className="sistema-page-kicker">
                        DOCUMENTAÇÃO
                    </span>

                    <h1>Alterar manual</h1>

                    <p>Atualize as informações deste manual.</p>
                </div>

                <Link
                    href={
                        catIDOriginal
                            ? `/sistema/manuais?categoria=${catIDOriginal}`
                            : "/sistema/categorias"
                    }
                    className="btn-sistema-secondary"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar
                </Link>

            </div>

            {carregando && (
                <div className="sistema-loading-inline">
                    <i className="fas fa-spinner fa-spin"></i>
                    Carregando manual...
                </div>
            )}

            {!carregando && erro && (
                <div className="sistema-alert sistema-alert-error">
                    <i className="fas fa-triangle-exclamation"></i>
                    Manual não encontrado.
                </div>
            )}

            {!carregando && !erro && (

                <form className="sistema-form-card" onSubmit={salvar}>

                    <div className="sistema-form-row">

                        <div className="sistema-form-group">
                            <label htmlFor="manNome">Nome do manual</label>
                            <input id="manNome" ref={nome} type="text" maxLength={150} />
                        </div>

                        <div className="sistema-form-group">
                            <label htmlFor="manVoltagem">Voltagem / tipo</label>
                            <select id="manVoltagem" ref={voltagem}>
                                {VOLTAGENS.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="sistema-form-row">

                        <div className="sistema-form-group">
                            <label htmlFor="catID">Categoria</label>
                            <select id="catID" ref={categoria}>
                                <option value="">Selecione uma categoria</option>
                                {categorias.map((cat) => (
                                    <option key={cat.catID} value={cat.catID}>
                                        {cat.catNome}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="sistema-form-row">

                        <div className="sistema-form-group">
                            <label htmlFor="manChaveR2">Chave do arquivo no R2</label>
                            <input id="manChaveR2" ref={chaveR2} type="text" />
                            <p className="sistema-form-hint">
                                Caminho completo do arquivo dentro do bucket
                                configurado no Cloudflare R2, incluindo a extensão .pdf.
                            </p>
                        </div>

                    </div>

                    <div className="sistema-form-check">
                        <input id="manAtivo" ref={ativo} type="checkbox" />
                        <label htmlFor="manAtivo">
                            Manual ativo (visível para os clientes)
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
                                    Excluir manual
                                </>
                            )}
                        </button>

                    </div>

                </form>
            )}

        </div>
    );
}
