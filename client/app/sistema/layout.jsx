"use client";

import { UserProvider, useUsuario } from "../context/userContext";

import Sidebar from "../components/sidebar";
import Header from "../components/header";

export default function SistemaLayout({ children }) {

    return (
        <UserProvider>
            <SistemaConteudo>
                {children}
            </SistemaConteudo>
        </UserProvider>
    );
}

function SistemaConteudo({ children }) {

    const {
        usuario,
        carregando
    } = useUsuario();

    if (carregando) {

        return (
            <div className="sistema-loading">

                <div className="sistema-loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>

                <p>
                    Carregando sistema...
                </p>

            </div>
        );
    }

    if (!usuario) {
        return null;
    }

    return (
        <div className="sistema">

            <Sidebar usuario={usuario} />

            <div className="sistema-main">

                <Header usuario={usuario} />

                <main className="sistema-content">
                    {children}
                </main>

                <footer className="sistema-footer">
                    © JCortiça Painéis Elétricos 2026
                </footer>

            </div>

        </div>
    );
}