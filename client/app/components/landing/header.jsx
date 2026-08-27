'use client'

import Link from "next/link";

export default function Header(){

    return(
        <nav className="navbar navbar-expand-lg navbar-dark landing-navbar fixed-top">
            <div className="container">

                <Link href="/" className="navbar-brand fw-bold">
                    JCortiça
                </Link>

                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#menu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menu">

                    <ul className="navbar-nav ms-auto align-items-center">

                        <li className="nav-item me-5">
                            <a href="#beneficios" className="nav-link">
                                Benefícios
                            </a>
                        </li>

                        <li className="nav-item me-5">
                            <Link href="/login" className="btn btn-outline-light">
                                Entrar
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link href="/login/criarConta" className="btn btn-warning">
                                Criar Conta
                            </Link>
                        </li>

                    </ul>

                </div>

            </div>
        </nav>
    )
}