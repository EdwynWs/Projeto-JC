"use client";

import { useEffect, useState } from "react";

export default function HomePage() {

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {

        async function carregarUsuario() {

            try {

                const response = await fetch(
                    "http://localhost:5001/usuario/logado",
                    {
                        credentials: "include"
                    }
                );

                if (response.ok) {

                    const dados = await response.json();

                    setUsuario(dados);

                }

            } catch (error) {

                console.error(error);

            }

        }

        carregarUsuario();

    }, []);

    const isAdmin =
        Number(usuario?.usu_per_id ?? usuario?.per_id ?? usuario?.perID) === 2;

    return (
        <div>

            <div className="dashboard-welcome">

                <span className="dashboard-welcome-label">
                    PAINEL DE CONTROLE
                </span>

                <h2>
                    Olá, {usuario?.usu_nome ?? usuario?.usuarioNome ?? "usuário"} 👋
                </h2>

                <p>
                    {isAdmin
                        ? "Gerencie os manuais, projetos elétricos, categorias e usuários do sistema."
                        : "Consulte os manuais técnicos disponíveis para você."
                    }
                </p>

            </div>


            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        <i className="fas fa-file-pdf"></i>
                    </div>

                    <div>
                        <span>Manuais</span>
                        <strong>Consultar documentos</strong>
                    </div>

                </div>


                {isAdmin && (
                    <>

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon">
                                <i className="fas fa-bolt"></i>
                            </div>

                            <div>
                                <span>Projetos</span>
                                <strong>Projetos elétricos</strong>
                            </div>

                        </div>


                        <div className="dashboard-card">

                            <div className="dashboard-card-icon">
                                <i className="fas fa-users"></i>
                            </div>

                            <div>
                                <span>Usuários</span>
                                <strong>Gerenciar acessos</strong>
                            </div>

                        </div>

                    </>
                )}

            </div>

        </div>
    );
}