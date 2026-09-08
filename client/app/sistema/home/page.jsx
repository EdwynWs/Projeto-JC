"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUsuario } from "../../context/userContext";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function HomePage() {

    const router = useRouter();

    const {
        usuario,
        ehAdmin,
        ehCliente
    } = useUsuario();

    const [categorias, setCategorias] = useState([]);

    const [busca, setBusca] = useState("");

    const [carregandoCategorias, setCarregandoCategorias] =
        useState(true);

    const [erroCategorias, setErroCategorias] =
        useState(false);

    /*
     * =====================================================
     * CARREGAR CATEGORIAS
     * =====================================================
     */

    useEffect(() => {

        async function carregarCategorias() {

            try {

                setCarregandoCategorias(true);
                setErroCategorias(false);

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

                const dados = await response.json();

                /*
                 * Mostra somente categorias ativas.
                 */
                const categoriasAtivas = Array.isArray(dados)
                    ? dados.filter(
                        (categoria) =>
                            categoria.catAtivo === true ||
                            Number(categoria.catAtivo) === 1
                    )
                    : [];

                setCategorias(categoriasAtivas);

            } catch (error) {

                console.error(
                    "Erro ao carregar categorias:",
                    error
                );

                setErroCategorias(true);

            } finally {

                setCarregandoCategorias(false);

            }
        }

        carregarCategorias();

    }, []);

    /*
     * =====================================================
     * FILTRO DE CATEGORIAS
     * =====================================================
     */

    const categoriasFiltradas = useMemo(() => {

        const termo = busca
            .trim()
            .toLowerCase();

        if (!termo) {
            return categorias;
        }

        return categorias.filter((categoria) => {

            const nome =
                categoria.catNome?.toLowerCase() || "";

            const descricao =
                categoria.catDescricao?.toLowerCase() || "";

            return (
                nome.includes(termo) ||
                descricao.includes(termo)
            );

        });

    }, [categorias, busca]);

    /*
     * =====================================================
     * ABRIR CATEGORIA
     * =====================================================
     */

    function abrirCategoria(categoria) {

        router.push(
            `/sistema/manuais?categoria=${categoria.catID}`
        );

    }

    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    return (
        <div className="dashboard">

            {/* =================================================
                BOAS-VINDAS
            ================================================= */}

            <section className="dashboard-welcome">

                <span className="dashboard-welcome-label">
                    PAINEL DE CONTROLE
                </span>

                <h2>
                    Olá,{" "}
                    {usuario?.usu_nome || "usuário"} 👋
                </h2>

                <p>

                    {ehAdmin()
                        ? "Gerencie os manuais, projetos elétricos, categorias e usuários do sistema."
                        : "Encontre rapidamente os manuais técnicos dos painéis elétricos."
                    }

                </p>

            </section>


            {/* =================================================
                ACESSOS ADMINISTRATIVOS
            ================================================= */}

            {ehAdmin() && (

                <section className="dashboard-admin-section">

                    <div className="dashboard-section-header">

                        <div>
                            <span className="dashboard-section-label">
                                ADMINISTRAÇÃO
                            </span>

                            <h3>
                                Acessos rápidos
                            </h3>
                        </div>

                    </div>


                    <div className="dashboard-admin-grid">

                        <Link
                            href="/sistema/projetos"
                            className="dashboard-admin-card"
                        >

                            <div className="dashboard-admin-icon">
                                <i className="fas fa-bolt"></i>
                            </div>

                            <div>

                                <strong>
                                    Projetos elétricos
                                </strong>

                                <span>
                                    Gerenciar projetos
                                </span>

                            </div>

                            <i className="fas fa-chevron-right dashboard-card-arrow"></i>

                        </Link>


                        <Link
                            href="/sistema/categorias"
                            className="dashboard-admin-card"
                        >

                            <div className="dashboard-admin-icon">
                                <i className="fas fa-folder"></i>
                            </div>

                            <div>

                                <strong>
                                    Categorias
                                </strong>

                                <span>
                                    Organizar manuais
                                </span>

                            </div>

                            <i className="fas fa-chevron-right dashboard-card-arrow"></i>

                        </Link>


                        <Link
                            href="/sistema/usuario"
                            className="dashboard-admin-card"
                        >

                            <div className="dashboard-admin-icon">
                                <i className="fas fa-users"></i>
                            </div>

                            <div>

                                <strong>
                                    Usuários
                                </strong>

                                <span>
                                    Gerenciar acessos
                                </span>

                            </div>

                            <i className="fas fa-chevron-right dashboard-card-arrow"></i>

                        </Link>

                    </div>

                </section>

            )}


            {/* =================================================
                MANUAIS
            ================================================= */}

            <section className="dashboard-manual-section">

                <div className="dashboard-section-header">

                    <div>

                        <span className="dashboard-section-label">
                            DOCUMENTAÇÃO TÉCNICA
                        </span>

                        <h3>
                            Categorias de manuais
                        </h3>

                        <p>
                            Selecione uma categoria para consultar
                            os manuais disponíveis.
                        </p>

                    </div>


                    <Link
                        href="/sistema/manuais"
                        className="dashboard-see-all"
                    >
                        Ver todos
                        <i className="fas fa-arrow-right"></i>
                    </Link>

                </div>


                {/* =================================================
                    BUSCA
                ================================================= */}

                <div className="dashboard-search">

                    <i className="fas fa-search"></i>

                    <input
                        type="text"
                        placeholder="Buscar categoria de manual..."
                        value={busca}
                        onChange={(e) =>
                            setBusca(e.target.value)
                        }
                    />

                    {busca && (

                        <button
                            type="button"
                            onClick={() => setBusca("")}
                            className="dashboard-search-clear"
                            title="Limpar busca"
                        >
                            <i className="fas fa-xmark"></i>
                        </button>

                    )}

                </div>


                {/* =================================================
                    CARREGANDO
                ================================================= */}

                {carregandoCategorias && (

                    <div className="dashboard-empty">

                        <div className="dashboard-empty-icon">
                            <i className="fas fa-spinner fa-spin"></i>
                        </div>

                        <strong>
                            Carregando categorias...
                        </strong>

                        <span>
                            Aguarde enquanto buscamos os manuais.
                        </span>

                    </div>

                )}


                {/* =================================================
                    ERRO
                ================================================= */}

                {!carregandoCategorias &&
                    erroCategorias && (

                        <div className="dashboard-empty">

                            <div className="dashboard-empty-icon error">
                                <i className="fas fa-triangle-exclamation"></i>
                            </div>

                            <strong>
                                Não foi possível carregar as categorias.
                            </strong>

                            <span>
                                Verifique se o servidor está funcionando.
                            </span>

                        </div>

                    )}


                {/* =================================================
                    SEM CATEGORIAS
                ================================================= */}

                {!carregandoCategorias &&
                    !erroCategorias &&
                    categoriasFiltradas.length === 0 && (

                        <div className="dashboard-empty">

                            <div className="dashboard-empty-icon">
                                <i className="fas fa-folder-open"></i>
                            </div>

                            <strong>
                                {busca
                                    ? "Nenhuma categoria encontrada."
                                    : "Nenhuma categoria cadastrada."
                                }
                            </strong>

                            <span>

                                {busca
                                    ? "Tente pesquisar por outro nome."
                                    : ehAdmin()
                                        ? "Cadastre uma categoria para começar a organizar os manuais."
                                        : "Ainda não existem manuais disponíveis."
                                }

                            </span>

                        </div>

                    )}


                {/* =================================================
                    CATEGORIAS
                ================================================= */}

                {!carregandoCategorias &&
                    !erroCategorias &&
                    categoriasFiltradas.length > 0 && (

                        <div className="dashboard-category-grid">

                            {categoriasFiltradas.map(
                                (categoria) => (

                                    <button
                                        key={categoria.catID}
                                        type="button"
                                        className="dashboard-category-card"
                                        onClick={() =>
                                            abrirCategoria(categoria)
                                        }
                                    >

                                        <div className="dashboard-category-icon">

                                            <i className="fas fa-folder"></i>

                                        </div>


                                        <div className="dashboard-category-content">

                                            <strong>
                                                {categoria.catNome}
                                            </strong>

                                            {categoria.catDescricao && (

                                                <span>
                                                    {categoria.catDescricao}
                                                </span>

                                            )}

                                            <small>
                                                Ver manuais
                                                <i className="fas fa-arrow-right"></i>
                                            </small>

                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    )}

            </section>


            {/* =================================================
                RODAPÉ DO DASHBOARD
            ================================================= */}

            <div className="dashboard-help">

                <div className="dashboard-help-icon">
                    <i className="fas fa-circle-info"></i>
                </div>

                <div>

                    <strong>
                        Precisa encontrar um manual específico?
                    </strong>

                    <span>
                        Use a busca acima para localizar rapidamente
                        a categoria do equipamento.
                    </span>

                </div>

            </div>

        </div>
    );
}