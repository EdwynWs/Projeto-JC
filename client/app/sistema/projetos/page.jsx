"use client";

import Link from "next/link";
import { useUsuario } from "../../context/userContext";

export default function ProjetosPage() {

    const { ehAdmin } = useUsuario();

    if (!ehAdmin()) {
        return (
            <div className="sistema-empty">
                <div className="sistema-empty-icon">
                    <i className="fas fa-lock"></i>
                </div>

                <h2>Acesso restrito</h2>

                <p>
                    Apenas administradores podem acessar
                    os projetos elétricos.
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
                        ADMINISTRAÇÃO
                    </span>

                    <h1>
                        Projetos Elétricos
                    </h1>

                    <p>
                        Gerencie os projetos elétricos
                        da JCortiça Painéis Elétricos.
                    </p>
                </div>

                <Link
                    href="/sistema/projetos/cadastrar"
                    className="btn-sistema"
                >
                    <i className="fas fa-plus"></i>
                    Novo projeto
                </Link>

            </div>

            <div className="sistema-empty">

                <div className="sistema-empty-icon">
                    <i className="fas fa-drafting-compass"></i>
                </div>

                <h2>Nenhum projeto disponível</h2>

                <p>
                    Em breve você poderá cadastrar,
                    visualizar e gerenciar os projetos
                    elétricos por aqui.
                </p>

            </div>

        </div>
    );
}