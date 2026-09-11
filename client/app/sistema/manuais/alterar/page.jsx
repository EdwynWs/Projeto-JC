"use client";

import Link from "next/link";

import { Suspense, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import toast from "react-hot-toast";

import { useUsuario } from "../../../context/userContext";

import ApiClient from "@/utils/apiClient";

const VOLTAGENS = ["Monofásico", "220V", "380V"];

export default function AlterarManualPage() {
    return (
        <Suspense
            fallback={
                <div className="sistema-loading-inline">
                    <i className="fas fa-spinner fa-spin"></i>
                    Carregando...
                </div>
            }
        >
            <AlterarManualConteudo />
        </Suspense>
    );
}

function AlterarManualConteudo() {
    const router = useRouter();

    const params = useSearchParams();

    const {
        usuario,
        carregando: carregandoUsuario,
        ehAdmin
    } = useUsuario();

    const manualId = params.get("id");

    const [categorias, setCategorias] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [salvando, setSalvando] = useState(false);

    const [excluindo, setExcluindo] = useState(false);

    const [erro, setErro] = useState(false);

    const [catIDOriginal, setCatIDOriginal] =
        useState(null);

    const [formulario, setFormulario] = useState({
        manNome: "",
        manVoltagem: VOLTAGENS[0],
        catID: "",
        manChaveR2: "",
        manAtivo: true
    });

    useEffect(() => {
        if (carregandoUsuario) {
            return;
        }

        if (!usuario) {
            return;
        }

        if (!ehAdmin()) {
            router.replace("/sistema/home");
            return;
        }

        if (!manualId) {
            setErro(true);
            setCarregando(false);
            return;
        }

        carregar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        manualId,
        usuario,
        carregandoUsuario
    ]);

    async function carregar() {
        try {
            setCarregando(true);

            setErro(false);

            const [
                categoriasResp,
                manuaisResp
            ] = await Promise.all([
                ApiClient.get("categoria/listar"),
                ApiClient.get("manual/listar")
            ]);

            const listaCategorias =
                Array.isArray(categoriasResp)
                    ? categoriasResp
                    : [];

            setCategorias(listaCategorias);

            const listaManuais =
                Array.isArray(manuaisResp)
                    ? manuaisResp
                    : [];

            const manual =
                listaManuais.find(
                    (item) =>
                        Number(item.manID) ===
                        Number(manualId)
                );

            if (!manual) {
                setErro(true);
                return;
            }

            setFormulario({
                manNome:
                    manual.manNome || "",

                manVoltagem:
                    manual.manVoltagem ||
                    VOLTAGENS[0],

                catID:
                    manual.catID !== null &&
                    manual.catID !== undefined
                        ? String(manual.catID)
                        : "",

                manChaveR2:
                    manual.manChaveR2 || "",

                manAtivo:
                    Number(manual.manAtivo) === 1 ||
                    manual.manAtivo === true
            });

            setCatIDOriginal(manual.catID);
        } catch (error) {
            console.error(
                "Erro ao carregar manual:",
                error
            );

            setErro(true);

            toast.error(
                error.message ||
                    "Não foi possível carregar o manual."
            );
        } finally {
            setCarregando(false);
        }
    }

    function alterarCampo(campo, valor) {
        setFormulario((anterior) => ({
            ...anterior,
            [campo]: valor
        }));
    }

    async function salvar(e) {
        e.preventDefault();

        setErro(false);

        const manNome =
            formulario.manNome.trim();

        const manVoltagem =
            formulario.manVoltagem;

        const catID =
            formulario.catID;

        const manChaveR2 =
            formulario.manChaveR2.trim();

        if (!manNome) {
            toast.error(
                "O nome do manual é obrigatório."
            );

            return;
        }

        if (!catID) {
            toast.error(
                "Selecione a categoria do manual."
            );

            return;
        }

        if (!manChaveR2) {
            toast.error(
                "Informe a chave (caminho) do arquivo no armazenamento."
            );

            return;
        }

        try {
            setSalvando(true);

            const resposta =
                await ApiClient.put(
                    `manual/modificar/${manualId}`,
                    {
                        manNome,

                        manVoltagem,

                        catID: Number(catID),

                        manChaveR2,

                        manAtivo:
                            formulario.manAtivo
                    }
                );

            if (resposta) {
                toast.success(
                    resposta.msg ||
                        "Manual atualizado com sucesso!"
                );

                router.push(
                    `/sistema/manuais?categoria=${catID}`
                );
            }
        } catch (error) {
            console.error(
                "Erro ao alterar manual:",
                error
            );

            toast.error(
                error.message ||
                    "Não foi possível alterar o manual."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function excluir() {
        const confirmar = confirm(
            "Deseja realmente excluir este manual?"
        );

        if (!confirmar) {
            return;
        }

        try {
            setExcluindo(true);

            const resposta =
                await ApiClient.delete(
                    `manual/excluir/${manualId}`
                );

            if (resposta) {
                toast.success(
                    resposta.msg ||
                        "Manual excluído com sucesso!"
                );

                router.push(
                    catIDOriginal
                        ? `/sistema/manuais?categoria=${catIDOriginal}`
                        : "/sistema/categorias"
                );
            }
        } catch (error) {
            console.error(
                "Erro ao excluir manual:",
                error
            );

            toast.error(
                error.message ||
                    "Não foi possível excluir o manual."
            );
        } finally {
            setExcluindo(false);
        }
    }

    if (
        carregandoUsuario ||
        carregando
    ) {
        return (
            <div className="sistema-loading-inline">

                <i className="fas fa-spinner fa-spin"></i>

                <span>
                    Carregando manual...
                </span>

            </div>
        );
    }

    if (!usuario || !ehAdmin()) {
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
                    alterar manuais.
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
                        DOCUMENTAÇÃO
                    </span>

                    <h1>
                        Alterar manual
                    </h1>

                    <p>
                        Atualize as informações deste manual.
                    </p>

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

            {!carregando && erro && (
                <div className="sistema-alert sistema-alert-error">

                    <i className="fas fa-triangle-exclamation"></i>

                    <span>
                        Manual não encontrado.
                    </span>

                </div>
            )}

            {!carregando && !erro && (
                <form
                    className="sistema-form-card"
                    onSubmit={salvar}
                >

                    <div className="sistema-form-row">

                        <div className="sistema-form-group">

                            <label htmlFor="manNome">
                                Nome do manual
                            </label>

                            <input
                                id="manNome"
                                type="text"
                                maxLength={150}
                                value={
                                    formulario.manNome
                                }
                                onChange={(e) =>
                                    alterarCampo(
                                        "manNome",
                                        e.target.value
                                    )
                                }
                                disabled={
                                    salvando ||
                                    excluindo
                                }
                            />

                        </div>

                        <div className="sistema-form-group">

                            <label htmlFor="manVoltagem">
                                Voltagem / tipo
                            </label>

                            <select
                                id="manVoltagem"
                                value={
                                    formulario.manVoltagem
                                }
                                onChange={(e) =>
                                    alterarCampo(
                                        "manVoltagem",
                                        e.target.value
                                    )
                                }
                                disabled={
                                    salvando ||
                                    excluindo
                                }
                            >

                                {VOLTAGENS.map(
                                    (voltagem) => (
                                        <option
                                            key={
                                                voltagem
                                            }
                                            value={
                                                voltagem
                                            }
                                        >
                                            {voltagem}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    <div className="sistema-form-row">

                        <div className="sistema-form-group">

                            <label htmlFor="catID">
                                Categoria
                            </label>

                            <select
                                id="catID"
                                value={
                                    formulario.catID
                                }
                                onChange={(e) =>
                                    alterarCampo(
                                        "catID",
                                        e.target.value
                                    )
                                }
                                disabled={
                                    salvando ||
                                    excluindo
                                }
                            >

                                <option value="">
                                    Selecione uma categoria
                                </option>

                                {categorias.map(
                                    (cat) => (
                                        <option
                                            key={
                                                cat.catID
                                            }
                                            value={
                                                cat.catID
                                            }
                                        >
                                            {
                                                cat.catNome
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    <div className="sistema-form-row">

                        <div className="sistema-form-group">

                            <label htmlFor="manChaveR2">
                                Chave do arquivo no armazenamento
                            </label>

                            <input
                                id="manChaveR2"
                                type="text"
                                value={
                                    formulario.manChaveR2
                                }
                                onChange={(e) =>
                                    alterarCampo(
                                        "manChaveR2",
                                        e.target.value
                                    )
                                }
                                disabled={
                                    salvando ||
                                    excluindo
                                }
                            />

                            <p className="sistema-form-hint">
                                Caminho completo do arquivo
                                dentro do bucket, incluindo
                                a extensão .pdf.
                            </p>

                        </div>

                    </div>

                    <div className="sistema-form-check">

                        <input
                            id="manAtivo"
                            type="checkbox"
                            checked={
                                formulario.manAtivo
                            }
                            onChange={(e) =>
                                alterarCampo(
                                    "manAtivo",
                                    e.target.checked
                                )
                            }
                            disabled={
                                salvando ||
                                excluindo
                            }
                        />

                        <label htmlFor="manAtivo">
                            Manual ativo (visível para os clientes)
                        </label>

                    </div>

                    <div className="sistema-form-actions">

                        <button
                            type="submit"
                            className="btn-sistema"
                            disabled={
                                salvando ||
                                excluindo
                            }
                        >

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
                            disabled={
                                salvando ||
                                excluindo
                            }
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