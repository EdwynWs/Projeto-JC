'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import ApiClient from "../../../utils/apiClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ConsorciosPage() {

    const [consorcios, setConsorcios] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const router = useRouter();

    async function carregarConsorcios() {
        const resposta = await ApiClient.get("consorcio/disponiveis");
        if (resposta) {
            setConsorcios(resposta);
        }

        setCarregando(false);
    }

    async function entrarConsorcio(consorcioId) {
        let resposta = await ApiClient.post("cota/participar", {
            consorcioId
        });

        if (resposta) {
            toast.success(resposta.msg);
            router.push("/sistema/cotas");
        }
    }

    useEffect(() => {
        carregarConsorcios();
    }, []);

    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor || 0);
    }

    function pegarImagem(c) {
        const imagem = c.imagem || c.con_imagem;
        const extensao = c.extensao || c.con_imagem_extensao || "png";

        if (!imagem) return null;

        return `data:image/${extensao};base64,${imagem}`;
    }

    function pegarId(c) {
        return c.id || c.con_id;
    }

    function pegarNome(c) {
        return c.nome || c.con_nome;
    }

    function pegarStatus(c) {
        return c.status || c.con_status;
    }

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h1 className="h3 mb-1" style={{ color: "#1f3c88", fontWeight: 800 }}>
                        Consórcios Disponíveis
                    </h1>
                    <p className="text-muted mb-0">
                        Escolha um consórcio disponível e participe adquirindo uma cota.
                    </p>
                </div>

                  <div className="d-flex gap-2">

                    <Link
                        href="/sistema/meus-consorcios"
                        className="btn btn-outline-primary"
                    >
                        <i className="fas fa-list mr-2"></i>
                        Meus Consórcios
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

            <div className="card shadow border-0" style={{ borderRadius: 20 }}>
                <div className="card-body p-4">

                    {carregando ? (
                        <p className="text-muted mb-0">Carregando...</p>
                    ) : consorcios.length === 0 ? (
                        <div className="text-center py-5">
                            <i
                                className="fas fa-file-contract mb-4"
                                style={{ fontSize: 60, color: "#1f3c88" }}
                            ></i>

                            <h3 className="fw-bold">
                                Nenhum consórcio disponível
                            </h3>

                            <p className="text-muted">
                                No momento não existem consórcios com cotas livres para participação.
                            </p>
                        </div>
                    ) : (
                        <div className="row">
                            {consorcios.map(c => (
                                <div className="col-12 col-md-6 col-xl-4 mb-4" key={pegarId(c)}>
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 18, overflow: "hidden" }}>

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
                                            <h5 className="fw-bold mb-2">
                                                {pegarNome(c)}
                                            </h5>

                                            <p className="text-muted mb-2">
                                                {(c.quantidadeCotas || c.con_quantidadecotas)} cotas disponíveis no grupo
                                            </p>

                                            <div className="mb-3">
                                                <small className="text-muted d-block">
                                                    Valor do prêmio
                                                </small>
                                                <h4 className="fw-bold mb-0" style={{ color: "#1f3c88" }}>
                                                    {formatarMoeda(c.valorPremio || c.con_valorpremio)}
                                                </h4>
                                            </div>

                                            <div className="mb-3">
                                                <small className="text-muted d-block">
                                                    Parcela mensal
                                                </small>
                                                <strong>
                                                    {formatarMoeda(c.valorMensal || c.con_valormensal)}
                                                </strong>
                                            </div>

                                            <span className="badge bg-warning text-dark mb-3">
                                                {pegarStatus(c)}
                                            </span>

                                            <button
                                                className="btn btn-primary w-100 mt-3"
                                                onClick={() => entrarConsorcio(pegarId(c))}
                                            >
                                                Participar
                                            </button>
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