"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUsuario } from "../../context/userContext";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001";

const TENSOES = [
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

export default function ManuaisPage() {

    const [excluindoManual, setExcluindoManual] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoriaId = searchParams.get("categoria");
    const [categoria, setCategoria] = useState(null);
    const [manuais, setManuais] = useState([]);
    const [tensaoSelecionada, setTensaoSelecionada] = useState("TODAS");
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const { ehAdmin } = useUsuario();
    const [abrindoManual, setAbrindoManual] = useState(null);

    useEffect(() => {
    if (!categoriaId) {
        return;
    }

    async function carregarDados() {
        try {
            setCarregando(true);
            setErro(false);

            const categoriasResponse = await fetch(
                `${API_URL}/categoria/listar`,
                {
                    credentials: "include"
                }
            );

            if (!categoriasResponse.ok) {
                throw new Error("Erro ao carregar categorias");
            }

            const categorias = await categoriasResponse.json();

            const categoriaEncontrada = categorias.find(
                (item) =>
                    Number(item.catID) === Number(categoriaId)
            );

            setCategoria(categoriaEncontrada || null);

            const manuaisResponse = await fetch(
                `${API_URL}/manual/listar?categoria=${categoriaId}`,
                {
                    credentials: "include"
                }
            );

            if (!manuaisResponse.ok) {
                throw new Error("Erro ao carregar manuais");
            }

            const dados = await manuaisResponse.json();

            setManuais(
                Array.isArray(dados)
                    ? dados
                    : []
            );

        } catch (error) {
            console.error(error);
            setErro(true);

        } finally {
            setCarregando(false);
        }
    }

    carregarDados();

    }, [categoriaId]);

    async function excluirManual(manual) {
    const confirmar = window.confirm(
        `Tem certeza que deseja excluir o manual "${manual.manNome}"?\n\n` +
        "O PDF também será excluído do armazenamento."
    );

    if (!confirmar) {
        return;
    }

    try {
        setExcluindoManual(manual.manID);

        const response = await fetch(
            `${API_URL}/manual/excluir/${manual.manID}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(
                dados.msg ||
                "Não foi possível excluir o manual."
            );
        }

        setManuais((lista) =>
            lista.filter(
                (item) =>
                    Number(item.manID) !==
                    Number(manual.manID)
            )
        );

    } catch (error) {
        console.error(
            "Erro ao excluir manual:",
            error
        );

        alert(
            error.message ||
            "Erro ao excluir manual."
        );

    } finally {
        setExcluindoManual(null);
    }
}


    const manuaisFiltrados = useMemo(() => {

        const termo = busca.trim().toLowerCase();

        return manuais.filter((manual) => {

            const nome = manual.manNome?.toLowerCase() || "";

            const chave = manual.manChaveR2?.toLowerCase() || "";

            const tensao =
                normalizarTensao(
                    manual.manVoltagem
                );

            const correspondeBusca = !termo || nome.includes(termo) || chave.includes(termo);

            const correspondeTensao = tensaoSelecionada === "TODAS" || tensao === tensaoSelecionada;

            return (
                correspondeBusca &&
                correspondeTensao
            );

        });

    }, [
        manuais,
        busca,
        tensaoSelecionada
    ]);

    const grupos = useMemo(() => {

        return TENSOES.map((tensao) => {

            const itens =
                manuaisFiltrados.filter(
                    (manual) =>
                        normalizarTensao(
                            manual.manVoltagem
                        ) === tensao.id
                );

            return {
                ...tensao,
                manuais: itens
            };

        });

    }, [manuaisFiltrados]);

    function voltar() {

        router.push(
            "/sistema/home"
        );

    }

    async function abrirManual(manual) {

        try {

            setAbrindoManual(manual.manID);

            const response = await fetch(
                `${API_URL}/manual/${manual.manID}/arquivo`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const dados = await response.json();

            if (!response.ok) {

                alert(
                    dados.mensagem ||
                    "Não foi possível abrir o manual."
                );

                return;
            }

            window.open(
                dados.url,
                "_blank",
                "noopener,noreferrer"
            );

        } catch (error) {

            console.error(
                "Erro ao abrir manual:",
                error
            );

            alert(
                "Erro ao abrir o manual."
            );

        } finally {

            setAbrindoManual(null);

        }
    }

    if (!categoriaId) {

        return (
            <div className="manual-page-empty">

                <div className="manual-empty-icon">
                    <i className="fas fa-folder-open"></i>
                </div>

                <h2>
                    Categoria não selecionada
                </h2>

                <p>
                    Selecione uma categoria para visualizar
                    os manuais.
                </p>

                <Link
                    href="/sistema/home"
                    className="manual-back-button"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar para categorias
                </Link>

            </div>
        );

    }

    if (carregando) {

        return (
            <div className="manual-page-loading">

                <i className="fas fa-spinner fa-spin"></i>

                <span>
                    Carregando manuais...
                </span>

            </div>
        );

    }

    if (erro) {

        return (
            <div className="manual-page-empty">

                <div className="manual-empty-icon error">
                    <i className="fas fa-triangle-exclamation"></i>
                </div>

                <h2>
                    Não foi possível carregar os manuais
                </h2>

                <p>
                    Verifique se o servidor está funcionando.
                </p>

                <button
                    type="button"
                    onClick={voltar}
                    className="manual-back-button"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar
                </button>

            </div>
        );

    }

    return (
        <div className="manual-page">

            {/* =================================================
                CABEÇALHO
            ================================================= */}

            <div className="manual-page-header">

    <div>
        <button
            type="button"
            onClick={voltar}
            className="manual-back-link"
        >
            <i className="fas fa-arrow-left"></i>
            Categorias
        </button>

        <span className="dashboard-section-label">
            DOCUMENTAÇÃO TÉCNICA
        </span>

        <h2>
            {categoria?.catNome || "Manuais"}
        </h2>

        {categoria?.catDescricao && (
            <p>
                {categoria.catDescricao}
            </p>
        )}
    </div>


    <div className="manual-page-header-actions">

        {ehAdmin() && (
            <Link
                href="/sistema/manuais/cadastrar"
                className="btn-sistema"
            >
                <i className="fas fa-plus"></i>
                Novo manual
            </Link>
        )}

        <div className="manual-page-count">

            <strong>
                {manuais.length}
            </strong>

            <span>
                {manuais.length === 1
                    ? "manual"
                    : "manuais"
                }
            </span>

        </div>

    </div>

</div>


            {/* =================================================
                BUSCA
            ================================================= */}

            <div className="manual-search">

                <i className="fas fa-search"></i>

                <input
                    type="text"
                    value={busca}
                    onChange={(e) =>
                        setBusca(e.target.value)
                    }
                    placeholder="Buscar manual..."
                />

                {busca && (

                    <button
                        type="button"
                        onClick={() =>
                            setBusca("")
                        }
                    >
                        <i className="fas fa-xmark"></i>
                    </button>

                )}

            </div>


            {/* =================================================
                FILTROS DE TENSÃO
            ================================================= */}

            <div className="manual-voltage-filters">

                <button
                    type="button"
                    className={
                        tensaoSelecionada === "TODAS"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setTensaoSelecionada("TODAS")
                    }
                >
                    <i className="fas fa-layer-group"></i>
                    Todos
                    <span>
                        {manuais.length}
                    </span>
                </button>


                {TENSOES.map((tensao) => {

                    const quantidade =
                        manuais.filter(
                            (manual) =>
                                normalizarTensao(
                                    manual.manVoltagem
                                ) === tensao.id
                        ).length;

                    return (

                        <button
                            key={tensao.id}
                            type="button"
                            className={
                                tensaoSelecionada ===
                                tensao.id
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setTensaoSelecionada(
                                    tensao.id
                                )
                            }
                        >

                            <i
                                className={`fas ${tensao.icone}`}
                            ></i>

                            {tensao.nome}

                            <span>
                                {quantidade}
                            </span>

                        </button>

                    );

                })}

            </div>


            {/* =================================================
                SEM RESULTADOS
            ================================================= */}

            {manuaisFiltrados.length === 0 && (

                <div className="manual-page-empty">

                    <div className="manual-empty-icon">
                        <i className="fas fa-file-circle-xmark"></i>
                    </div>

                    <h2>
                        Nenhum manual encontrado
                    </h2>

                    <p>
                        Tente alterar a busca ou selecionar
                        outra tensão.
                    </p>

                </div>

            )}


            {/* =================================================
                GRUPOS
            ================================================= */}

            {manuaisFiltrados.length > 0 && (

                <div className="manual-voltage-groups">

                    {grupos
                        .filter(
                            (grupo) =>
                                grupo.manuais.length > 0
                        )
                        .map((grupo) => (

                            <section
                                key={grupo.id}
                                className="manual-voltage-group"
                            >

                                <div className="manual-group-header">

                                    <div>

                                        <span>
                                            TENSÃO
                                        </span>

                                        <h3>
                                            {grupo.nome}
                                        </h3>

                                    </div>

                                    <strong>
                                        {grupo.manuais.length}
                                    </strong>

                                </div>


                                <div className="manual-list">

                                    {grupo.manuais.map(
                                        (manual) => (

                                            <ManualCard
                                                key={manual.manID}
                                                manual={manual}
                                                onOpen={abrirManual}
                                                onDelete={excluirManual}
                                                isAdmin={ehAdmin()}
                                            />

                                        )
                                    )}

                                </div>

                            </section>

                        ))}

                </div>

            )}

        </div>
    );
}

function ManualCard({
    manual,
    onOpen
}) {

    const caminho =
        manual.manChaveR2 || "";

    const pasta =
        extrairPasta(caminho);

    return (

        <div className="manual-card">

            <div className="manual-card-icon">
                <i className="fas fa-file-pdf"></i>
            </div>


            <div className="manual-card-info">

                <strong>
                    {manual.manNome}
                </strong>

                {pasta && (

                    <span className="manual-card-folder">
                        <i className="fas fa-folder"></i>
                        {pasta}
                    </span>

                )}

                <small>
                    {manual.manVoltagem}
                </small>

            </div>


            <div className="manual-card-actions">

    <button
        className="manual-card-btn"
        onClick={() => onOpen(manual)}
    >
        <i className="fas fa-file-pdf"></i>
        Abrir PDF
    </button>

    {isAdmin && (
        <>
            <Link
                href={`/sistema/manuais/alterar?id=${manual.manID}`}
                className="manual-card-action-edit"
            >
                <i className="fas fa-edit"></i>
                Editar
            </Link>

            <button
                type="button"
                className="manual-card-action-delete"
                onClick={() =>
                    onDelete(manual)
                }
            >
                <i className="fas fa-trash"></i>
                Excluir
            </button>
        </>
    )}

        </div>

        </div>

    );
}

function normalizarTensao(valor) {

    if (!valor) {
        return "";
    }

    const texto =
        String(valor)
            .trim()
            .toUpperCase()
            .replace(" ", "");

    if (
        texto === "MONOFASICO" ||
        texto === "MONOFÁSICO" ||
        texto === "MONO"
    ) {
        return "MONOFASICO";
    }

    if (texto.includes("220")) {
        return "220V";
    }

    if (texto.includes("380")) {
        return "380V";
    }

    return texto;
}

function extrairPasta(chave) {

    if (!chave) {
        return "";
    }

    const partes =
        chave
            .split("/")
            .filter(Boolean);

    if (partes.length <= 1) {
        return "";
    }

    partes.pop();

    if (partes.length === 0) {
        return "";
    }

    return partes[partes.length - 1];
}