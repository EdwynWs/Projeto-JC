'use client'

import Link from "next/link";

export default function Cta() {
    return (
        <section className="py-5 cta-section text-white">
            <div className="container text-center py-4">
                <h2 className="display-5 fw-bold mb-3">
                    Comece hoje mesmo
                </h2>

                <p className="lead mb-4">
                    Crie sua conta e acesse seus manuais técnicos.
                </p>

                <Link href="/login/criarConta" className="btn btn-warning btn-lg">
                    Criar Conta
                </Link>
            </div>
        </section>
    );
}