'use client'

import { useEffect, useState } from "react";
import ApiClient from "../../../utils/apiClient";
import Link from "next/link";

export default function MeusConsorciosPage() {

    const [consorcios, setConsorcios] = useState([]);
    const [carregando, setCarregando] = useState(true);

    async function carregar() {
        let resposta = await ApiClient.get("consorcio/meus");

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

    function pegarId(c) {
        return c.id || c.con_id;
    }

    function pegarNome(c) {
        return c.nome || c.con_nome;
    }

    function pegarQuantidadeCotas(c) {
        return c.quantidadeCotas || c.con_quantidadecotas;
    }

    function pegarValorPremio(c) {
        return c.valorPremio || c.con_valorpremio;
    }

    function pegarValorMensal(c) {
        return c.valorMensal || c.con_valormensal;
    }

    function pegarStatus(c) {
        return c.status || c.con_status;
    }

    function pegarImagem(c) {
        const imagem = c.imagem || c.con_imagem;
        const extensao = c.extensao || c.con_imagem_extensao || "png";

        if (!imagem) return null;

        return `data:image/${extensao};base64,${imagem}`;
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
                        Meus Consórcios
                    </h1>

                    <p className="text-muted mb-0">
                        Acompanhe os consórcios que você criou ou participa.
                    </p>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                    <Link
                        href="/sistema/consorcios"
                        className="btn btn-outline-primary"
                    >
                        <i className="fas fa-search mr-2"></i>
                        Ver Disponíveis
                    </Link>

                    <Link
                        href="/sistema/consorcios/cadastrar"
                        className="btn btn-primary"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Criar Consórcio
                    </Link>
                </div>
            </div>

            <div
                className="card shadow border-0"
                style={{
                    borderRadius: 20
                }}
            >
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
                                Carregando seus consórcios...
                            </p>
                        </div>
                    ) : consorcios.length === 0 ? (
                        <div className="text-center py-5">
                            <i
                                className="fas fa-layer-group mb-4"
                                style={{
                                    fontSize: 60,
                                    color: "#1f3c88"
                                }}
                            ></i>

                            <h3 className="fw-bold">
                                Você ainda não possui consórcios
                            </h3>

                            <p className="text-muted">
                                Crie seu próprio consórcio ou participe de um disponível.
                            </p>

                            <div className="d-flex justify-content-center gap-2 flex-wrap mt-4">
                                <Link
                                    href="/sistema/consorcios"
                                    className="btn btn-outline-primary"
                                >
                                    Ver Consórcios
                                </Link>

                                <Link
                                    href="/sistema/consorcios/cadastrar"
                                    className="btn btn-primary"
                                >
                                    Criar Consórcio
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {consorcios.map(c => (
                                <div
                                    className="col-12 col-md-6 col-xl-4 mb-4"
                                    key={pegarId(c)}
                                >
                                    <div
                                        className="card border-0 shadow-sm h-100"
                                        style={{
                                            borderRadius: 18,
                                            overflow: "hidden"
                                        }}
                                    >
                                        {pegarImagem(c) ? (
                                            <img
                                                src={pegarImagem(c)}
                                                alt={pegarNome(c)}
                                                style={{
                                                    width: "100%",
                                                    height: 210,
                                                    objectFit: "cover"
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    height: 210,
                                                    background: "#edf2f9",
                                                    color: "#1f3c88",
                                                    fontSize: 46
                                                }}
                                            >
                                                <i className="fas fa-car"></i>
                                            </div>
                                        )}

                                        <div className="card-body">

                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h5 className="fw-bold mb-0">
                                                    {pegarNome(c)}
                                                </h5>

                                                <span
                                                    className={
                                                        pegarStatus(c) === "FINALIZADO"
                                                            ? "badge bg-success"
                                                            : "badge bg-warning text-dark"
                                                    }
                                                >
                                                    {pegarStatus(c)}
                                                </span>
                                            </div>

                                            <div className="row text-center mb-3">
                                                <div className="col-6">
                                                    <small className="text-muted d-block">
                                                        Cotas
                                                    </small>

                                                    <strong>
                                                        {pegarQuantidadeCotas(c)}
                                                    </strong>
                                                </div>

                                                <div className="col-6">
                                                    <small className="text-muted d-block">
                                                        Parcela
                                                    </small>

                                                    <strong>
                                                        {formatarMoeda(pegarValorMensal(c))}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <small className="text-muted d-block">
                                                    Valor do prêmio
                                                </small>

                                                <h4
                                                    className="fw-bold mb-0"
                                                    style={{
                                                        color: "#1f3c88"
                                                    }}
                                                >
                                                    {formatarMoeda(pegarValorPremio(c))}
                                                </h4>
                                            </div>

                                                   <Link
                                                href={`/sistema/assembleias?consorcio=${pegarId(c)}`}
                                                className="btn btn-outline-primary w-100"
                                            >
                                                Ver Assembleias
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}