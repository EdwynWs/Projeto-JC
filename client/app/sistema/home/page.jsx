'use client'

import { useEffect, useState } from "react";
import ApiClient from "@/utils/apiClient";
import Link from "next/link";

export default function SistemaHome() {

    const [consorcios, setConsorcios] = useState([]);
    const [carregando, setCarregando] = useState(true);

    async function carregar() {
        const resposta = await ApiClient.get("consorcio/meus");

        if (resposta) {
            setConsorcios(resposta);
        }

        setCarregando(false);
    }

    useEffect(() => {
        carregar();
    }, []);

    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor || 0);
    }

    function obterStatus(c) {
        return c.status || c.con_status || "";
    }

    const totalConsorcios = consorcios.length;

    const totalAtivos = consorcios.filter(
        c => obterStatus(c) === "EM PROCESSO"
    ).length;

    const totalFinalizados = consorcios.filter(
        c => obterStatus(c) === "FINALIZADO"
    ).length;

    return (
        <div className="container-fluid">

            <div className="card shadow border-0 mb-4" style={{ borderRadius: 20 }}>
                <div className="card-body p-4">
                    <h1 className="mb-2" style={{ color: "#1f3c88", fontWeight: 800 }}>
                        Dashboard
                    </h1>

                    <p className="text-muted mb-0">
                        Acompanhe seus consórcios, cotas e assembleias.
                    </p>
                </div>
            </div>

            <div className="row">

                <div className="col-12 col-md-4 mb-4">
                    <div className="card shadow border-0 h-100" style={{ borderRadius: 18 }}>
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">Total de Consórcios</p>
                                <h2 className="fw-bold mb-0">{totalConsorcios}</h2>
                            </div>

                            <div className="rounded d-flex align-items-center justify-content-center"
                                style={{ width: 58, height: 58, background: "#1f3c88", color: "#fff", fontSize: 24 }}>
                                <i className="fas fa-layer-group"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4 mb-4">
                    <div className="card shadow border-0 h-100" style={{ borderRadius: 18 }}>
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">Em Processo</p>
                                <h2 className="fw-bold mb-0">{totalAtivos}</h2>
                            </div>

                            <div className="rounded d-flex align-items-center justify-content-center"
                                style={{ width: 58, height: 58, background: "#f6c23e", color: "#fff", fontSize: 24 }}>
                                <i className="fas fa-clock"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4 mb-4">
                    <div className="card shadow border-0 h-100" style={{ borderRadius: 18 }}>
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">Finalizados</p>
                                <h2 className="fw-bold mb-0">{totalFinalizados}</h2>
                            </div>

                            <div className="rounded d-flex align-items-center justify-content-center"
                                style={{ width: 58, height: 58, background: "#22c55e", color: "#fff", fontSize: 24 }}>
                                <i className="fas fa-check"></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {carregando ? (
                <div className="card shadow border-0" style={{ borderRadius: 20 }}>
                    <div className="card-body py-5 text-center">
                        <p className="text-muted mb-0">Carregando...</p>
                    </div>
                </div>
            ) : consorcios.length === 0 ? (
                <div className="card shadow border-0" style={{ borderRadius: 20 }}>
                    <div className="card-body text-center py-5">

                        <i
                            className="fas fa-layer-group mb-4"
                            style={{ fontSize: 60, color: "#1f3c88" }}
                        ></i>

                        <h3 className="fw-bold">
                            Você ainda não possui consórcios
                        </h3>

                        <p className="text-muted">
                            Crie um consórcio ou participe de um existente para começar.
                        </p>

                        <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
                            <Link href="/sistema/consorcios" className="btn btn-primary">
                                Participar de Consórcio
                            </Link>

                            <Link href="/sistema/meus-consorcios" className="btn btn-outline-primary">
                                Meus Consórcios
                            </Link>
                        </div>

                    </div>
                </div>
            ) : (
                <div className="card shadow border-0" style={{ borderRadius: 20 }}>
                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                            <div>
                                <h3 className="fw-bold mb-1">Meus Consórcios</h3>
                                <p className="text-muted mb-0">
                                    Consórcios que você criou ou participa.
                                </p>
                            </div>

                            <Link href="/sistema/consorcios" className="btn btn-primary">
                                Ver Consórcios
                            </Link>
                        </div>

                        <div className="row">
                            {consorcios.slice(0, 3).map((c) => (
                                <div className="col-12 col-md-4 mb-4" key={c.id || c.con_id}>
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 18, overflow: "hidden" }}>

                                        {c.imagem || c.con_imagem ? (
                                            <img
                                                src={`data:image/${c.extensao || c.con_imagem_extensao};base64,${c.imagem || c.con_imagem}`}
                                                style={{ width: "100%", height: 200, objectFit: "cover" }}
                                                alt={c.nome || c.con_nome}
                                            />
                                        ) : (
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{ height: 200, background: "#edf2f9", color: "#1f3c88", fontSize: 42 }}
                                            >
                                                <i className="fas fa-car"></i>
                                            </div>
                                        )}

                                        <div className="card-body">
                                            <h5 className="fw-bold mb-2">
                                                {c.nome || c.con_nome}
                                            </h5>

                                            <p className="text-muted mb-2">
                                                {c.quantidadeCotas || c.con_quantidadecotas} cotas
                                            </p>

                                            <h4 className="fw-bold mb-3" style={{ color: "#1f3c88" }}>
                                                {formatarMoeda(c.valorPremio || c.con_valorpremio)}
                                            </h4>

                                            <span
                                                className={
                                                    obterStatus(c) === "FINALIZADO"
                                                        ? "badge bg-success"
                                                        : "badge bg-warning text-dark"
                                                }
                                            >
                                                {obterStatus(c)}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}