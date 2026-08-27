'use client'

import Link from "next/link";

export default function Hero() {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center min-vh-100">
                    <div className="col-12 col-md-6">
                        <span className="badge bg-warning text-dark mb-3 px-3 py-2">
                            Plataforma de Manuais Técnicos
                        </span>

                        <h1 className="display-4 fw-bold text-white mb-4">
                            Acesse seus manuais de painéis elétricos de forma simples e rápida
                        </h1>

                        <p className="lead text-light mb-4">
                            Encontre, consulte e baixe os manuais técnicos dos seus painéis elétricos em uma única plataforma.
                        </p>

                        <div className="d-flex gap-3 hero-buttons">
                            <Link href="/login" className="btn btn-warning btn-lg">
                                Acessar Plataforma
                            </Link>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 text-center">
                        <img
                            src="/carro.png"
                            className="img-fluid hero-image"
                            alt="Carro consórcio"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}