"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Loading from "../../components/loading";
import ApiClient from "@/utils/apiClient";

export default function HomeUsuario() {

    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alterandoStatusId, setAlterandoStatusId] = useState(null);

    async function carregarUsuarios() {

        try {

            setLoading(true);

            const response = await ApiClient.get("usuario");

            if (response) {
                setLista(response);
            }

        } catch (error) {

            console.error("Erro ao carregar usuários:", error);
            toast.error("Erro ao carregar os usuários.");

        } finally {

            setLoading(false);

        }
    }


    async function excluir(id) {

        if (!confirm("Deseja realmente excluir este usuário?")) {
            return;
        }

        try {

            const resposta = await ApiClient.delete(
                "usuario/" + id
            );

            if (resposta) {

                toast.success(
                    resposta.msg || "Usuário excluído com sucesso."
                );

                await carregarUsuarios();
            }

        } catch (error) {

            console.error("Erro ao excluir usuário:", error);
            toast.error("Erro ao excluir o usuário.");

        }
    }


    async function alterarStatus(id, nome, ativo) {

        const acao = ativo ? "inativar" : "ativar";

        const confirmar = confirm(
            `Deseja realmente ${acao} o usuário ${nome}?`
        );

        if (!confirmar) {
            return;
        }

        try {

            setAlterandoStatusId(id);

            const endpoint = ativo
                ? "usuario/" + id + "/inativar"
                : "usuario/" + id + "/ativar";

            const resposta = await ApiClient.patch(
                endpoint,
                {}
            );

            if (resposta) {

                toast.success(
                    resposta.msg ||
                    (
                        ativo
                            ? "Usuário inativado com sucesso."
                            : "Usuário ativado com sucesso."
                    )
                );

                await carregarUsuarios();
            }

        } catch (error) {

            console.error(
                "Erro ao alterar status do usuário:",
                error
            );

            toast.error(
                ativo
                    ? "Erro ao inativar o usuário."
                    : "Erro ao ativar o usuário."
            );

        } finally {

            setAlterandoStatusId(null);

        }
    }


    useEffect(() => {
        carregarUsuarios();
    }, []);


    function pegarId(u) {
        return u.usu_id ?? u.id;
    }


    function pegarNome(u) {
        return u.usu_nome ?? u.nome;
    }


    function pegarEmail(u) {
        return u.usu_email ?? u.email;
    }


    function pegarAtivo(u) {

        /*
         * Banco:
         * 1 = ativo
         * 0 = inativo
         *
         * O ?? é importante porque 0 é um valor válido.
         */

        return u.usu_ativo ?? u.ativo ?? u.Ativo;
    }


    function usuarioEstaAtivo(u) {

        const ativo = pegarAtivo(u);

        return (
            Number(ativo) === 1 ||
            ativo === true ||
            String(ativo).toUpperCase() === "S"
        );
    }


    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>

                    <h1
                        className="h3 mb-1"
                        style={{
                            color: "#1f3c88",
                            fontWeight: 800
                        }}
                    >
                        Usuários
                    </h1>

                    <p className="text-muted mb-0">
                        Gerencie os usuários cadastrados no sistema.
                    </p>

                </div>


                <Link
                    className="btn btn-primary"
                    href="/sistema/usuario/cadastrar"
                >

                    <i className="fas fa-plus mr-2"></i>

                    Cadastrar Usuário

                </Link>

            </div>


            <div
                className="card shadow border-0"
                style={{
                    borderRadius: 20
                }}
            >

                <div className="card-body p-4">

                    {loading ? (

                        <div className="text-center py-5">

                            <Loading />

                        </div>

                    ) : lista.length > 0 ? (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>

                                        <th>ID</th>

                                        <th>Nome</th>

                                        <th>E-mail</th>

                                        <th>Status</th>

                                        <th className="text-right">
                                            Ações
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {lista.map((value) => {

                                        const id = pegarId(value);

                                        const nome = pegarNome(value);

                                        const email = pegarEmail(value);

                                        const ativo =
                                            usuarioEstaAtivo(value);

                                        const alterando =
                                            alterandoStatusId === id;


                                        return (

                                            <tr key={id}>

                                                <td>
                                                    {id}
                                                </td>


                                                <td>

                                                    <strong>
                                                        {nome}
                                                    </strong>

                                                </td>


                                                <td>
                                                    {email}
                                                </td>


                                                <td>

                                                    {ativo ? (

                                                        <button
                                                            type="button"
                                                            className="badge bg-success border-0"
                                                            style={{
                                                                cursor: alterando
                                                                    ? "wait"
                                                                    : "pointer",
                                                                padding: "8px 12px"
                                                            }}
                                                            title="Clique para inativar este usuário"
                                                            disabled={alterando}
                                                            onClick={() =>
                                                                alterarStatus(
                                                                    id,
                                                                    nome,
                                                                    true
                                                                )
                                                            }
                                                        >

                                                            {alterando ? (

                                                                <>

                                                                    <span
                                                                        className="spinner-border spinner-border-sm mr-1"
                                                                        role="status"
                                                                    ></span>

                                                                    Inativando...

                                                                </>

                                                            ) : (

                                                                <>

                                                                    <i className="fas fa-check-circle mr-1"></i>

                                                                    Ativo

                                                                </>

                                                            )}

                                                        </button>

                                                    ) : (

                                                        <button
                                                            type="button"
                                                            className="badge bg-danger border-0"
                                                            style={{
                                                                cursor: alterando
                                                                    ? "wait"
                                                                    : "pointer",
                                                                padding: "8px 12px"
                                                            }}
                                                            title="Clique para ativar este usuário"
                                                            disabled={alterando}
                                                            onClick={() =>
                                                                alterarStatus(
                                                                    id,
                                                                    nome,
                                                                    false
                                                                )
                                                            }
                                                        >

                                                            {alterando ? (

                                                                <>

                                                                    <span
                                                                        className="spinner-border spinner-border-sm mr-1"
                                                                        role="status"
                                                                    ></span>

                                                                    Ativando...

                                                                </>

                                                            ) : (

                                                                <>

                                                                    <i className="fas fa-ban mr-1"></i>

                                                                    Inativo

                                                                </>

                                                            )}

                                                        </button>

                                                    )}

                                                </td>


                                                <td className="text-right">

                                                    <Link
                                                        href={
                                                            "/sistema/usuario/alterar/" +
                                                            id
                                                        }
                                                        className="btn btn-sm btn-outline-primary mr-2"
                                                        title="Editar usuário"
                                                    >

                                                        <i className="fas fa-pen"></i>

                                                    </Link>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            excluir(id)
                                                        }
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Excluir usuário"
                                                    >

                                                        <i className="fas fa-trash"></i>

                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div className="text-center py-5">

                            <i
                                className="fas fa-users mb-4"
                                style={{
                                    fontSize: 60,
                                    color: "#1f3c88"
                                }}
                            ></i>


                            <h3 className="fw-bold">
                                Nenhum usuário cadastrado
                            </h3>


                            <p className="text-muted">

                                Cadastre o primeiro usuário
                                para começar.

                            </p>


                            <Link
                                href="/sistema/usuario/cadastrar"
                                className="btn btn-primary mt-3"
                            >

                                Cadastrar Usuário

                            </Link>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}