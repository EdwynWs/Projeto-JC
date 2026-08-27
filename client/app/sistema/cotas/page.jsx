'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import ApiClient from "../../../utils/apiClient";
import toast from "react-hot-toast";

export default function CotasPage() {

    const [cotas, setCotas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);

    const itensPorPagina = 8;

     async function carregarCotas() {
    setCarregando(true);

    const minhas = await ApiClient.get("cota/minhas");
    const gestao = await ApiClient.get("cota/gestao");

    let lista = [];

    if (minhas) {
        lista = [
            ...lista,
            ...minhas.map(c => ({
                ...c,
                tipo: "MINHA"
            }))
        ];
    }

    if (gestao) {
        lista = [
            ...lista,
            ...gestao.map(c => ({
                ...c,
                tipo: "GESTAO"
            }))
        ];
    }

    setCotas(lista);
    setCarregando(false);
    }

    useEffect(() => {
        carregarCotas();
    }, []);

    function statusClass(status) {
        if (status === "CONTEMPLADA") return "badge bg-success";
        if (status === "INADIMPLENTE") return "badge bg-danger";
        return "badge bg-warning text-dark";
    }

    async function vincularCota(cotId) {
        const usuId = prompt("Digite o ID do usuário que comprou esta cota:");

        if (!usuId) {
            return;
        }

        const resposta = await ApiClient.post("cota", {
            cotId,
            usuId
        });

        if (resposta) {
            toast.success(resposta.msg);
            carregarCotas();
        }
    }

    const totalPaginas = Math.ceil(cotas.length / itensPorPagina);

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    const cotasPaginadas = cotas.slice(inicio, fim);

    const totalCotas = cotas.length;
    const cotasLivres = cotas.filter(c => !c.participante_nome && !c.usu_nome).length;
    const cotasContempladas = cotas.filter(c => c.cot_status === "CONTEMPLADA").length;
    const cotasInadimplentes = cotas.filter(c => c.cot_status === "INADIMPLENTE").length;

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
                        Minhas Cotas
                    </h1>

                    <p className="text-muted mb-0">
                        Acompanhe suas cotas e gerencie as cotas livres dos seus consórcios.
                    </p>
                </div>

                <Link href="/sistema/consorcios" className="btn btn-primary">
                    <i className="fas fa-plus mr-2"></i>
                    Participar de Consórcio
                </Link>
            </div>

            <div className="row">

                <div className="col-12 col-md-3 mb-4">
                    <div className="card shadow border-0 h-100" style={{ borderRadius: 18 }}>
                        <div className="card-body">
                            <p className="text-muted mb-1">Total</p>
                            <h2 className="fw-bold mb-0">{totalCotas}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3 mb-4">
                    <div className="card shadow border-0 h-100" style={{ borderRadius: 18 }}>
                        <div className="card-body">
                            <p className="text-muted mb-1">Livres</p>
                            <h2 className="fw-bold mb-0">{cotasLivres}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3 mb-4">
                    <div className="card shadow border-0 h-100" style={{ borderRadius: 18 }}>
                        <div className="card-body">
                            <p className="text-muted mb-1">Contempladas</p>
                            <h2 className="fw-bold mb-0">{cotasContempladas}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3 mb-4">
                    <div className="card shadow border-0 h-100" style={{ borderRadius: 18 }}>
                        <div className="card-body">
                            <p className="text-muted mb-1">Inadimplentes</p>
                            <h2 className="fw-bold mb-0">{cotasInadimplentes}</h2>
                        </div>
                    </div>
                </div>

            </div>

            <div className="card shadow border-0" style={{ borderRadius: 20 }}>
                <div className="card-body p-4">

                    {carregando ? (
                        <div className="text-center py-5">
                            <i
                                className="fas fa-spinner fa-spin mb-3"
                                style={{
                                    fontSize: 36,
                                    color: "#1f3c88"
                                }}
                            ></i>

                            <p className="text-muted mb-0">
                                Carregando cotas...
                            </p>
                        </div>
                    ) : cotas.length === 0 ? (
                        <div className="text-center py-5">
                            <i
                                className="fas fa-ticket-alt mb-4"
                                style={{
                                    fontSize: 60,
                                    color: "#1f3c88"
                                }}
                            ></i>

                            <h3 className="fw-bold">
                                Você ainda não possui cotas
                            </h3>

                            <p className="text-muted">
                                Participe de um consórcio ou crie um consórcio para começar.
                            </p>

                            <div className="d-flex justify-content-center gap-2 flex-wrap mt-4">
                                <Link href="/sistema/consorcios" className="btn btn-primary">
                                    Participar de Consórcio
                                </Link>

                                <Link href="/sistema/consorcios/cadastrar" className="btn btn-outline-primary">
                                    Criar Consórcio
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Número</th>
                                            <th>Consórcio</th>
                                            <th>Participante</th>
                                            <th>Status</th>
                                            <th>Tipo</th>
                                            <th className="text-right">Ação</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {cotasPaginadas.map((c) => {
                                            const participante =
                                                c.participante_nome ||
                                                c.usu_nome ||
                                                null;

                                            return (
                                                <tr key={c.cot_id}>
                                                    <td>{c.cot_id}</td>

                                                    <td>
                                                        <strong>#{c.cot_numero}</strong>
                                                    </td>

                                                    <td>{c.con_nome}</td>

                                                    <td>
                                                        {participante ? (
                                                            participante
                                                        ) : (
                                                            <span className="text-muted">
                                                                Cota livre
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {c.tipo === "GESTAO" ? (
                                                            <span className="badge bg-primary">Gestão</span>
                                                        ) : (
                                                            <span className="badge bg-info">Minha cota</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span className={statusClass(c.cot_status)}>
                                                            {c.cot_status}
                                                        </span>
                                                    </td>

                                                     <td className="text-right">
                                                        {c.tipo === "GESTAO" && !participante ? (
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => vincularCota(c.cot_id)}
                                                            >
                                                                Vincular
                                                            </button>
                                                        ) : participante ? (
                                                            <span className="text-muted small">
                                                                Vinculada
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted small">
                                                                Apenas visualização
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {totalPaginas > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
                                    <p className="text-muted mb-0">
                                        Página {paginaAtual} de {totalPaginas}
                                    </p>

                                    <div className="btn-group">
                                        <button
                                            className="btn btn-outline-primary"
                                            disabled={paginaAtual === 1}
                                            onClick={() => setPaginaAtual(paginaAtual - 1)}
                                        >
                                            Anterior
                                        </button>

                                        <button
                                            className="btn btn-outline-primary"
                                            disabled={paginaAtual === totalPaginas}
                                            onClick={() => setPaginaAtual(paginaAtual + 1)}
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>

        </div>
    );
}