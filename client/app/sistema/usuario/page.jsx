'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/loading";
import ApiClient from "@/utils/apiClient";

export default function HomeUsuario() {

    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inativandoId, setInativandoId] = useState(null);

    async function carregarUsuarios() {
        const response = await ApiClient.get("usuario");

        if (response) {
            setLista(response);
        }

        setLoading(false);
    }

    async function excluir(id) {
        if (!confirm("Deseja realmente excluir este usuário?")) {
            return;
        }

        let resposta = await ApiClient.delete("usuario/" + id);

        if (resposta) {
            toast.success(resposta.msg);
            carregarUsuarios();
        }
    }

    async function inativar(id, nome) {
    const confirmar = confirm(
        `Deseja realmente desativar o usuário ${nome}?`
    );

    if (!confirmar) {
        return;
    }

    setInativandoId(id);

    const resposta = await ApiClient.patch(
        "usuario/" + id + "/inativar",
        {}
    );

    if (resposta) {
        toast.success(resposta.msg);
        await carregarUsuarios();
    }

    setInativandoId(null);
   }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    function pegarId(u) {
        return u.id || u.usu_id;
    }

    function pegarNome(u) {
        return u.nome || u.usu_nome;
    }

    function pegarEmail(u) {
        return u.email || u.usu_email;
    }

    function pegarAtivo(u) {
        return u.ativo || u.Ativo || u.usu_ativo;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h1 className="h3 mb-1" style={{color: "#1f3c88", fontWeight: 800}}>
                        Usuários
                    </h1>

                    <p className="text-muted mb-0">
                        Gerencie os usuários cadastrados no sistema.
                    </p>
                </div>

                <Link className="btn btn-primary" href="/sistema/usuario/cadastrar">
                    <i className="fas fa-plus mr-2"></i>
                    Cadastrar Usuário
                </Link>
            </div>

            <div
                className="card shadow border-0" style={{borderRadius: 20}}>
                <div className="card-body p-4">
                    {
                        loading ? (
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
                                            <th className="text-right">Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            lista.map((value) => (
                                                <tr key={pegarId(value)}>
                                                    <td>{pegarId(value)}</td>

                                                    <td>
                                                        <strong>
                                                            {pegarNome(value)}
                                                        </strong>
                                                    </td>

                                                    <td>{pegarEmail(value)}</td>
                                                    <td>
                                                        {
                                                            pegarAtivo(value) === "S" ? (
                                                                <button type="button" className="badge bg-success border-0" style={{ cursor: "pointer", padding: "8px 12px"}}
                                                                    title="Clique para desativar este usuário"
                                                                    disabled={inativandoId === pegarId(value)}
                                                                    onClick={() =>
                                                                        inativar(pegarId(value), pegarNome(value))}>
                                                                    {
                                                                        inativandoId === pegarId(value) ? (
                                                                            <>
                                                                                <span className="spinner-border spinner-border-sm mr-1" role="status"></span>
                                                                                Desativando...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="fas fa-check-circle mr-1"></i>
                                                                                Ativo
                                                                            </>
                                                                        )
                                                                    }
                                                                </button>
                                                            ) : (
                                                                <span className="badge bg-danger" style={{padding: "8px 12px"}}>
                                                                    <i className="fas fa-ban mr-1"></i>
                                                                    Inativo
                                                                </span>
                                                            )
                                                        }
                                                    </td>

                                                    <td className="text-right">
                                                        <Link href={"/sistema/usuario/alterar/" + pegarId(value)} className="btn btn-sm btn-outline-primary mr-2">
                                                            <i className="fas fa-pen"></i>
                                                        </Link>

                                                        <button onClick={() => excluir(pegarId(value))} className="btn btn-sm btn-outline-danger">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <i className="fas fa-users mb-4" style={{fontSize: 60, color: "#1f3c88"}}></i>
                                <h3 className="fw-bold">
                                    Nenhum usuário cadastrado
                                </h3>
                                <p className="text-muted">
                                    Cadastre o primeiro usuário para começar.
                                </p>
                                <Link href="/sistema/usuario/cadastrar" className="btn btn-primary mt-3">
                                    Cadastrar Usuário
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}