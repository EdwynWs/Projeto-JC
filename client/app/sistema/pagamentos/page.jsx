"use client";

import { useState, useEffect } from "react";
import api from "@/utils/apiClient";
import toast from "react-hot-toast";


export default function PagamentosPage() {

    const [valor, setValor] = useState("");
    const [cotId, setCotId] = useState("");
    const [assId, setAssId] = useState("");
    const [cotas, setCotas] = useState([]);

    const [loading, setLoading] = useState(false);

    const [paymentUrl, setPaymentUrl] = useState("");
    const [gatewayId, setGatewayId] = useState("");

    const [status, setStatus] = useState("");
    const [mensagem, setMensagem] = useState("");

async function gerarPagamento() {

    try {

        if (!valor || !cotId || !assId) {

            toast.error("Preencha todos os campos");

            return;
        }

        setLoading(true);

        let response = await api.post("pagamento", {
            valor,
            cot_id: cotId,
            ass_id: assId
        });

        if (!response) {
            return;
        }

        /*
            CASO JÁ EXISTA PAGAMENTO
        */
        if (response.existente) {

            setMensagem(
                "Já existe um pagamento pendente para esta cota e assembleia."
            );

            setStatus("PENDENTE");

            setPaymentUrl(response.paymentUrl);
            setGatewayId(response.gatewayId);

            toast.error("PIX já foi gerado anteriormente");

            return;
        }

        setPaymentUrl(response.paymentUrl);
        setGatewayId(response.gatewayId);

        setStatus("PENDENTE");

        setMensagem("");

        toast.success("PIX gerado com sucesso!");

    }
    catch (error) {

        console.error(error);

        toast.error("Erro ao gerar pagamento");
    }
    finally {
        setLoading(false);
    }
}
useEffect(() => {

    carregarCotas();

    async function carregarCotas(){

    let response = await api.get("cota/minhas");
    
    if(response){

        setCotas(response);
    }
}

    if (!gatewayId) return;

    

    const interval = setInterval(async () => {

        try {

            const response = await api.get(
                `pagamento/status/${gatewayId}`
            );

            if (response.status === "CONFIRMADO") {

                setStatus("CONFIRMADO");

                clearInterval(interval);

                toast.success("Pagamento confirmado!");

            }

        }
        catch (error) {

            console.error(error);

        }

    }, 5000);

    return () => clearInterval(interval);

}, [gatewayId]);

    return (

        <div
            className="container-fluid py-4 px-4"
            style={{
                backgroundColor: "#f4f6fb",
                minHeight: "100vh"
            }}
        >

            {/* TÍTULO */}
            <div className="mb-4">

                <h1
                    style={{
                        fontSize: "54px",
                        fontWeight: "300",
                        color: "#5f6b7a"
                    }}
                >
                    Pagamento PIX
                </h1>

                <p
                    style={{
                        color: "#8b95a7",
                        marginTop: "-5px"
                    }}
                >
                    Gere o pagamento da sua parcela e acompanhe o status.
                </p>

            </div>

            {/* CARD GERAR PAGAMENTO */}
            <div
                className="card border-0 shadow-sm mb-4"
                style={{
                    borderRadius: "22px"
                }}
            >

                <div className="card-body p-4">

                    <h3
                        className="mb-4"
                        style={{
                            color: "#1e3a8a",
                            fontWeight: "700"
                        }}
                    >
                        Gerar Pagamento
                    </h3>

                    <div className="row g-4">

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Valor da parcela (R$)
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                placeholder="200"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                style={{
                                    height: "50px",
                                    borderRadius: "12px"
                                }}
                            />

                        </div>

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Cota
                            </label>

                             <select
                                className="form-control"
                                value={cotId}
                                onChange={(e) => setCotId(e.target.value)}
                                style={{
                                    height: "50px",
                                    borderRadius: "12px"
                                }}
                                  >
                                <option value="">
                                    Selecione sua cota
                                </option>

                                {cotas.map((c) => (
                                   <option key={c.cot_id} value={c.cot_id}>
                                        Cota #{c.cot_numero} - {c.con_nome}
                                    </option>
                                 ))}
                              </select>

                        </div>

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Assembleia
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                placeholder="2"
                                value={assId}
                                onChange={(e) => setAssId(e.target.value)}
                                style={{
                                    height: "50px",
                                    borderRadius: "12px"
                                }}
                            />

                        </div>

                        <div className="col-md-3 d-flex align-items-end">

                            <button
                                onClick={gerarPagamento}
                                className="btn w-100 text-white"
                                style={{
                                    height: "50px",
                                    borderRadius: "14px",
                                    fontWeight: "bold",
                                    border: "none",
                                    background:
                                        "linear-gradient(90deg, #3b82f6, #1d4ed8)"
                                }}
                                disabled={loading}
                            >
                                Gerar PIX
                            </button>

                        </div>

                    </div>

                    <div
                        className="mt-4 p-3"
                        style={{
                            backgroundColor: "#eef2ff",
                            borderRadius: "12px",
                            color: "#4f46e5",
                            fontWeight: "500"
                        }}
                    >
                         Informe a cota e assembleia referentes à parcela
                        que deseja pagar.
                    </div>

                </div>

            </div>

            {/* STATUS */}
            {
                status &&
                <div
                    className="card border-0 shadow-sm mb-4"
                    style={{
                        borderRadius: "22px"
                    }}
                >

                    <div className="card-body p-4">

                        <h3
                            className="mb-4"
                            style={{
                                fontWeight: "700",
                                color: "#1f2937"
                            }}
                        >
                            Status do Pagamento
                        </h3>

                        <div className="row align-items-center">

                            <div className="col-md-6">

                                <div className="d-flex align-items-center gap-3">

                                    <div
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            borderRadius: "50%",
                                            backgroundColor: "#fff7ed",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "32px"
                                        }}
                                    >
                                        ⏳
                                    </div>

                                    <div>

                                        <div
                                            style={{
                                                color: "#6b7280",
                                                fontSize: "15px"
                                            }}
                                        >
                                            Status atual
                                        </div>

                                        <div
                                            style={{
                                                color:
                                                    status === "CONFIRMADO"
                                                        ? "#16a34a"
                                                        : "#f59e0b",
                                                fontSize: "38px",
                                                fontWeight: "700",
                                                lineHeight: "38px"
                                            }}
                                        >
                                            {status}
                                        </div>

                                        <div
                                            style={{
                                                color: "#6b7280"
                                            }}
                                        >
                                            {
                                                status === "CONFIRMADO"
                                                    ? "Pagamento confirmado com sucesso."
                                                    : "Aguardando pagamento."
                                            }
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div
                                    style={{
                                        borderLeft: "1px solid #e5e7eb",
                                        paddingLeft: "30px"
                                    }}
                                >

                                    <div
                                        style={{
                                            color: "#6b7280",
                                            fontSize: "15px"
                                        }}
                                    >
                                        Vencimento
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "30px",
                                            fontWeight: "700",
                                            color: "#1f2937"
                                        }}
                                    >
                                        26/05/2025
                                    </div>

                                    <div
                                        style={{
                                            color: "#6b7280"
                                        }}
                                    >
                                        Segunda-feira
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            }

            {/* PAGAMENTO GERADO */}
            {
                paymentUrl &&
                <div
                    className="card border-0 shadow-sm"
                    style={{
                        borderRadius: "22px"
                    }}
                >

                    <div className="card-body p-4">

                        <h3
                            className="mb-4"
                            style={{
                                color: "#1e3a8a",
                                fontWeight: "700"
                            }}
                        >
                            Pagamento Gerado
                        </h3>

                        <div className="d-flex flex-column gap-4">

                            <a
                                href={paymentUrl}
                                target="_blank"
                                className="btn text-white"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #2563eb, #1d4ed8)",
                                    borderRadius: "12px",
                                    height: "52px",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "none"
                                }}
                            >
                                Abrir Link de Pagamento
                            </a>

                            <div>

                                <label className="form-label fw-bold">
                                    Link do pagamento
                                </label>

                                <input
                                    className="form-control"
                                    value={paymentUrl}
                                    readOnly
                                    style={{
                                        height: "50px",
                                        borderRadius: "12px"
                                    }}
                                />

                            </div>

                            <div>

                                <label className="form-label fw-bold">
                                    Gateway ID
                                </label>

                                <input
                                    className="form-control"
                                    value={gatewayId}
                                    readOnly
                                    style={{
                                        height: "50px",
                                        borderRadius: "12px"
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>
            }

            {/* ALERTA */}
            {
    mensagem &&
    <div
        className="mt-4 p-4"
        style={{
            backgroundColor: "#fff7ed",
            border: "1px solid #fdba74",
            borderRadius: "14px"
        }}
    >

        <div
            style={{
                color: "#c2410c",
                fontWeight: "700",
                fontSize: "18px"
            }}
        >
            ⚠️ Atenção
        </div>

        <div
            style={{
                color: "#9a3412",
                marginTop: "6px"
            }}
        >
            {mensagem}
        </div>

    </div>
}

        </div>
    );
}