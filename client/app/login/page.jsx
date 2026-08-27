'use client'

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import ApiClient from "../../utils/apiClient";
import "./login.css";
import Link from "next/link";

export default function LoginPage() {

    const email = useRef(null);
    const senha = useRef(null);

    const [carregando, setCarregando] = useState(false);

    const router = useRouter();

    async function logar(e) {
        e.preventDefault();

        if (!email.current.value || !senha.current.value) {
            toast.error("Preencha o e-mail e a senha!");
            return;
        }

        setCarregando(true);

        const resposta = await ApiClient.post("usuario/login", {
            usuarioEmail: email.current.value,
            usuarioSenha: senha.current.value
        });

        setCarregando(false);

        if (resposta) {
            const usuarioLogado = resposta.usuario ?? resposta;

            localStorage.setItem("usuario", JSON.stringify(usuarioLogado));

            router.replace("/sistema/home");
}
    }

    return (
        <div className="login-page">
            <div className="login-glow login-glow-one"></div>
            <div className="login-glow login-glow-two"></div>

            <div className="container position-relative">
                <div className="row justify-content-center align-items-center min-vh-100 py-5">
                    <div className="col-xl-11 col-lg-12 col-md-10">

                        <div className="card login-card">
                            <div className="row g-0">

                                <div className="col-lg-6 d-none d-lg-flex login-banner">
                                    <div className="banner-content">

                                        <Link href="/" className="brand-link">
                                            <i className="fa-solid fa-layer-group"></i>
                                            JCortiça Paineis
                                        </Link>

                                        <span className="badge-consorcio">
                                            ELÉTRICO
                                        </span>

                                        <h1>
                                            Transforme organização em eficiência.
                                        </h1>

                                        <p>
                                            Plataforma para centralizar, organizar e consultar os manuais
                                            técnicos dos projetos de painéis elétricos.
                                        </p>

                                        <div className="banner-footer">
                                            <div>
                                                <strong>100%</strong>
                                                <span>Organizado</span>
                                            </div>

                                            <div>
                                                <strong>24h</strong>
                                                <span>Acesso</span>
                                            </div>

                                            <div>
                                                <strong>PDF</strong>
                                                <span>Manuais</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="login-content">

                                        <div className="mobile-brand d-lg-none">
                                            <Link href="/" className="brand-link dark">
                                                <i className="fa-solid fa-layer-group"></i>
                                                FIPP Consórcios
                                            </Link>
                                        </div>

                                        <div className="brand-area">
                                            <span className="small-label">
                                                Acesse sua conta
                                            </span>

                                            <h2>Bem-vindo</h2>

                                            <p>
                                                Faça login para continuar no sistema
                                            </p>
                                        </div>

                                        <form className="user" onSubmit={logar}>

                                            <div className="input-area">
                                                <label>E-mail</label>
                                                <div className="input-wrapper">
                                                   
                                                    <input
                                                        ref={email}
                                                        type="email"
                                                        className="form-control custom-input"
                                                        placeholder="Digite seu e-mail"
                                                        disabled={carregando}
                                                    />
                                                </div>
                                            </div>

                                            <div className="input-area">
                                                <label>Senha</label>
                                                <div className="input-wrapper">
                                                
                                                    <input
                                                        ref={senha}
                                                        type="password"
                                                        className="form-control custom-input"
                                                        placeholder="Digite sua senha"
                                                        disabled={carregando}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={carregando}
                                                className="btn login-btn w-100"
                                            >
                                                {
                                                    carregando
                                                        ? (
                                                            <>
                                                                <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                                Entrando...
                                                            </>
                                                        )
                                                        : "Entrar no Sistema"
                                                }
                                            </button>

                                            <div className="login-actions">
                                                <span>Ainda não tem conta?</span>
                                                <Link href="/login/criarConta">
                                                    Criar conta
                                                </Link>
                                            </div>

                                        </form>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}