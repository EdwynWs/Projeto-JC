'use client'

import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function FormUsuario({ usuario }) {

    const router = useRouter();

    const [alteracao, setAlteracao] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const nome = useRef("");
    const email = useRef("");
    const senha = useRef("");
    const ativo = useRef();

    function pegarId(u) {
        return u.id || u.usu_id;
    }

    async function gravar(e) {
        e.preventDefault();

        if (
            nome.current.value === "" ||
            email.current.value === "" ||
            senha.current.value === "" ||
            ativo.current.value === ""
        ) {
            toast.error("Preencha corretamente os campos do formulário");
            return;
        }

        setSalvando(true);

        let response = await ApiClient.post("usuario", {
            usuarioNome: nome.current.value,
            usuarioEmail: email.current.value,
            usuarioSenha: senha.current.value,
            usuarioAtivo: ativo.current.value
        });

        setSalvando(false);

        if (response) {
            toast.success(response.msg || "Usuário cadastrado com sucesso!");
            router.push("/sistema/usuario");
        }
    }

    async function alterar(e) {
        e.preventDefault();

        if (
            nome.current.value === "" ||
            email.current.value === "" ||
            ativo.current.value === ""
        ) {
            toast.error("Preencha corretamente os campos do formulário");
            return;
        }

        setSalvando(true);

        let body = {
            usuarioNome: nome.current.value,
            usuarioEmail: email.current.value,
            usuarioAtivo: ativo.current.value
        };

        if (senha.current.value !== "") {
            body.usuarioSenha = senha.current.value;
        }

        let response = await ApiClient.put("usuario/" + pegarId(usuario), body);

        setSalvando(false);

        if (response) {
            toast.success(response.msg || "Usuário alterado com sucesso!");
            router.push("/sistema/usuario");
        }
    }

    useEffect(() => {
        if (usuario) {
            nome.current.value = usuario.nome || usuario.usu_nome || "";
            email.current.value = usuario.email || usuario.usu_email || "";
            ativo.current.value = usuario.ativo || usuario.Ativo || usuario.usu_ativo || "S";
            setAlteracao(true);
        }
    }, [usuario]);

    return (
        <div
            className="card shadow border-0"
            style={{
                borderRadius: 20
            }}
        >
            <div className="card-body p-4">
                <form onSubmit={alteracao ? alterar : gravar}>
                    <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">
                                Nome
                            </label>

                            <input
                                ref={nome}
                                type="text"
                                className="form-control"
                                placeholder="Digite o nome"
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">
                                E-mail
                            </label>

                            <input
                                ref={email}
                                type="email"
                                className="form-control"
                                placeholder="Digite o e-mail"
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">
                                Senha
                            </label>

                            <input
                                ref={senha}
                                type="password"
                                className="form-control"
                                placeholder={
                                    alteracao
                                        ? "Deixe vazio para manter a senha atual"
                                        : "Digite a senha"
                                }
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">
                                Status
                            </label>

                            <select ref={ativo} className="form-control">
                                <option value="S">Ativo</option>
                                <option value="N">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                        <button
                            type="submit"
                            disabled={salvando}
                            className="btn btn-primary mr-2"
                        >
                            {
                                salvando ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check mr-2"></i>
                                        {alteracao ? "Alterar" : "Cadastrar"}
                                    </>
                                )
                            }
                        </button>

                        <Link
                            href="/sistema/usuario"
                            className="btn btn-secondary"
                        >
                            Voltar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}