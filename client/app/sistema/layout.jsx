"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "../components/sidebar";
import Header from "../components/header";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function SistemaLayout({ children }) {

    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {

        async function carregarUsuario() {

            try {

                const response = await fetch(
                    `${API_URL}/usuario/logado`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    router.replace("/login");
                    return;
                }

                const dados = await response.json();

                setUsuario(dados);

            } catch (error) {

                console.error("Erro ao carregar usuário:", error);

                router.replace("/login");

            } finally {

                setCarregando(false);

            }
        }

        carregarUsuario();

    }, [router]);

    if (carregando) {

        return (
            <div className="sistema-loading">

                <div className="sistema-loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>

                <p>Carregando sistema...</p>

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