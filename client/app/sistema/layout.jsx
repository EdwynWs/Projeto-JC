'use client'

import Script from "next/script";
import Link from "next/link";
import { UserProvider } from "../context/userContext";
import UserContext from "../context/userContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import ApiClient from "@/utils/apiClient";

function LayoutInterno({ children }) {

    const { usuario, limparUsuario } = useContext(UserContext);
    const router = useRouter();

    async function logout() {
      await ApiClient.post("usuario/logout");
      limparUsuario();
      router.replace("/");
}

    return (
        <div id="wrapper">

            <ul
                className="navbar-nav sidebar sidebar-dark accordion"
                id="accordionSidebar"
                style={{
                    background: "linear-gradient(180deg, #1f3c88 0%, #14275e 100%)"
                }}
            >
                <Link
                    className="sidebar-brand d-flex align-items-center justify-content-center"
                    href="/sistema/home"
                >
                    <div className="sidebar-brand-icon">
                        <i className="fas fa-coins"></i>
                    </div>

                    <div className="sidebar-brand-text mx-3">
                        FippConsórcio
                    </div>
                </Link>

                <hr className="sidebar-divider my-0" />

                <li className="nav-item">
                    <Link className="nav-link" href="/sistema/home">
                        <i className="fas fa-home"></i>
                        <span> Home</span>
                    </Link>
                </li>

                <hr className="sidebar-divider" />

                <div className="sidebar-heading">
                    Gestão
                </div>

                <li className="nav-item">
                    <Link className="nav-link" href="/sistema/consorcios">
                        <i className="fas fa-file-contract"></i>
                        <span> Consórcios</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" href="/sistema/cotas">
                        <i className="fas fa-ticket-alt"></i>
                        <span> Cotas</span>
                    </Link>
                </li>


                <li className="nav-item">
                    <Link className="nav-link" href="/sistema/pagamentos">
                        <i className="fas fa-money-bill-wave"></i>
                        <span> Pagamentos</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" href="/sistema/usuario">
                        <i className="fas fa-users"></i>
                        <span> Usuários</span>
                    </Link>
                </li>

                <hr className="sidebar-divider d-none d-md-block" />
            </ul>

            <div id="content-wrapper" className="d-flex flex-column">

                <div id="content">

                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm">

                        <button
                            id="sidebarToggleTop"
                            className="btn btn-link d-md-none rounded-circle mr-3"
                        >
                            <i className="fa fa-bars"></i>
                        </button>

                        <h4 className="m-0 font-weight-bold" style={{ color: "#1f3c88" }}>
                            Sistema de Gestão de Consórcios
                        </h4>

                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown no-arrow position-relative">

                                <button
                                    className="nav-link border-0 bg-transparent d-flex align-items-center"
                                    onClick={() => {
                                        const menu = document.getElementById("menuUsuario");
                                        menu.classList.toggle("show");
                                    }}
                                >
                                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                         {usuario ? (usuario.nome || usuario.usu_nome || usuario.usuarioNome) : "Usuário"}
                                    </span>

                                    <img
                                        className="img-profile rounded-circle"
                                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                        width="35"
                                        alt="perfil"
                                    />
                                </button>

                                <div
                                    id="menuUsuario"
                                    className="dropdown-menu dropdown-menu-right shadow"
                                    style={{ right: 0, left: "auto" }}
                                >
                                    <button className="dropdown-item" onClick={logout}>
                                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Sair
                                    </button>
                                </div>

                            </li>
                        </ul>

                    </nav>

                    <div className="container-fluid">
                        {children}
                    </div>

                </div>

                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                            <span>© FippConsórcio 2026</span>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}

export default function SistemaLayout({ children }) {
    return (
        <UserProvider>
            <LayoutInterno>
                {children}
            </LayoutInterno>

            <Script src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="beforeInteractive" />
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
            <Script src="https://cdn.jsdelivr.net/npm/startbootstrap-sb-admin-2@4.1.4/js/sb-admin-2.min.js" strategy="afterInteractive" />
        </UserProvider>
    );
}