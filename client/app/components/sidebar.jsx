"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ usuario }) {

    const pathname = usePathname();

    const isAdmin = Number(usuario?.per_id ?? usuario?.perID) === 2;

    function ativo(path) {
        return pathname === path ||
            pathname.startsWith(path + "/");
    }

    return (
        <aside className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo">

                <div className="sidebar-logo-icon">
                    <i className="fas fa-layer-group"></i>
                </div>

                <div className="sidebar-logo-text">

                    <strong>JCortiça</strong>

                    <span>Painéis Elétricos</span>

                </div>

            </div>


            {/* USUÁRIO */}
            <div className="sidebar-user">

                <div className="sidebar-user-avatar">
                    <i className="fas fa-user"></i>
                </div>

                <div className="sidebar-user-info">

                    <strong>
                        {usuario?.usu_nome ?? usuario?.usuarioNome}
                    </strong>

                    <span>
                        {isAdmin ? "Administrador" : "Cliente"}
                    </span>

                </div>

            </div>


            {/* MENU */}
            <nav className="sidebar-menu">

                <span className="sidebar-section-title">
                    PRINCIPAL
                </span>

                <Link
                    href="/sistema/home"
                    className={`sidebar-link ${
                        ativo("/sistema/home") ? "active" : ""
                    }`}
                >
                    <i className="fas fa-house"></i>
                    <span>Dashboard</span>
                </Link>


                <span className="sidebar-section-title">
                    DOCUMENTAÇÃO
                </span>

                <Link
                    href="/sistema/manuais"
                    className={`sidebar-link ${
                        ativo("/sistema/manuais") ? "active" : ""
                    }`}
                >
                    <i className="fas fa-file-pdf"></i>
                    <span>Manuais</span>
                </Link>


                {/* SOMENTE ADMIN */}
                {isAdmin && (
                    <>
                        <span className="sidebar-section-title">
                            ADMINISTRAÇÃO
                        </span>

                        <Link
                            href="/sistema/projetos"
                            className={`sidebar-link ${
                                ativo("/sistema/projetos")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <i className="fas fa-bolt"></i>
                            <span>Projetos Elétricos</span>
                        </Link>

                        <Link
                            href="/sistema/categorias"
                            className={`sidebar-link ${
                                ativo("/sistema/categorias")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <i className="fas fa-folder"></i>
                            <span>Categorias</span>
                        </Link>

                        <Link
                            href="/sistema/usuario"
                            className={`sidebar-link ${
                                ativo("/sistema/usuario")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <i className="fas fa-users"></i>
                            <span>Usuários</span>
                        </Link>
                    </>
                )}

            </nav>


            {/* RODAPÉ */}
            <div className="sidebar-footer">

                <div className="sidebar-status">
                    <span className="status-dot"></span>
                    Sistema online
                </div>

            </div>

        </aside>
    );
}