"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function FormUsuario() {
    const router = useRouter();

    const nome = useRef("");
    const email = useRef("");
    const senha = useRef("");

    const [salvando, setSalvando] = useState(false);

    async function gravar(e) {
        e.preventDefault();

        if (
            nome.current.value === "" ||
            email.current.value === "" ||
            senha.current.value === ""
        ) {
            toast.error("Preencha todos os campos.");
            return;
        }

        setSalvando(true);

        try {
            const response = await fetch(
                "http://localhost:5001/usuario",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        usuarioNome: nome.current.value,
                        usuarioEmail: email.current.value,
                        usuarioSenha: senha.current.value,
                    })
                }
            );

            const corpo = await response.json();

            if (response.ok) {
                toast.success(
                    corpo.msg || "Conta criada com sucesso!"
                );

                router.push("/login");
            } else {
                toast.error(
                    corpo.msg || "Não foi possível criar a conta."
                );
            }

        } catch (error) {
            console.error(error);

            toast.error(
                "Não foi possível conectar ao servidor."
            );

        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="cadastro-page">

            {/* Fundo da página */}
            <div className="cadastro-background"></div>

            {/* Escurecimento da imagem */}
            <div className="cadastro-overlay"></div>

            {/* Conteúdo */}
            <main className="cadastro-container">

                <div className="cadastro-card">

                    {/* Cabeçalho */}
                    <div className="cadastro-header">

                        <Link
                            href="/"
                            className="cadastro-brand"
                        >
                            <i className="fa-solid fa-layer-group"></i>

                            <span>
                                JCortiça Painéis
                            </span>
                        </Link>

                        <span className="cadastro-badge">
                            ELÉTRICO
                        </span>

                        <h1>
                            Crie sua conta
                        </h1>

                        <p>
                            Cadastre-se para acessar os manuais
                            técnicos dos projetos de painéis elétricos.
                        </p>

                    </div>

                    {/* Formulário */}
                    <form onSubmit={gravar}>

                        {/* Nome */}
                        <div className="form-group">

                            <label htmlFor="nome">
                                Nome
                            </label>

                            <input
                                id="nome"
                                ref={nome}
                                type="text"
                                className="form-control"
                                placeholder="Digite seu nome"
                                disabled={salvando}
                                autoComplete="name"
                            />

                        </div>

                        {/* E-mail */}
                        <div className="form-group">

                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                ref={email}
                                type="email"
                                className="form-control"
                                placeholder="Digite seu e-mail"
                                disabled={salvando}
                                autoComplete="email"
                            />

                        </div>

                        {/* Senha */}
                        <div className="form-group">

                            <label htmlFor="senha">
                                Senha
                            </label>

                            <input
                                id="senha"
                                ref={senha}
                                type="password"
                                className="form-control"
                                placeholder="Digite sua senha"
                                disabled={salvando}
                                autoComplete="new-password"
                            />

                        </div>

                        {/* Botões */}
                        <div className="form-actions">

                            <button
                                type="submit"
                                disabled={salvando}
                                className="btn-confirmar"
                            >

                                {salvando ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Criando conta...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus"></i>
                                        Criar minha conta
                                    </>
                                )}

                            </button>

                            <Link
                                href="/login"
                                className="btn-voltar"
                            >
                                Voltar
                            </Link>

                        </div>

                    </form>

                    {/* Login */}
                    <div className="cadastro-login">

                        <span>
                            Já possui uma conta?
                        </span>

                        <Link href="/login">
                            Entrar no sistema
                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}