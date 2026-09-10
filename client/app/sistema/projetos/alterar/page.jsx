"use client";

import Link from "next/link";
import { useUsuario } from "../../../context/userContext";

export default function AlterarProjetoPage() {

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

                <Link href="/sistema/home" className="btn-sistema">
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

                    <h1>Alterar projeto</h1>

                    <p>Edição de projetos elétricos.</p>
                </div>

                <Link href="/sistema/projetos" className="btn-sistema-secondary">
                    <i className="fas fa-arrow-left"></i>
                    Voltar
                </Link>

            </div>

            <div className="sistema-empty">

                <div className="sistema-empty-icon">
                    <i className="fas fa-drafting-compass"></i>
                </div>

                <h2>Em construção</h2>

                <p>
                    A edição de projetos elétricos ainda
                    está sendo desenvolvida e estará disponível
                    em breve.
                </p>

            </div>

        </div>
    );
}
