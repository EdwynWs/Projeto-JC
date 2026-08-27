'use client'

import FormUsuario from "@/app/components/formUsuario";
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AlterarUsuarioPage() {

    const params = useParams();
    const id = params.id;

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregarUsuario() {
        let response = await ApiClient.get("usuario/" + id);

        if (response) {
            setUsuario(response);
        }

        setLoading(false);
    }

    useEffect(() => {
        if (id) {
            carregarUsuario();
        }
    }, [id]);

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
                        Alterar Usuário
                    </h1>

                    <p className="text-muted mb-0">
                        Atualize os dados do usuário selecionado.
                    </p>
                </div>

                <Link
                    href="/sistema/usuario"
                    className="btn btn-outline-primary"
                >
                    Voltar
                </Link>
            </div>

            {
                loading ? (
                    <div className="card shadow border-0" style={{ borderRadius: 20 }}>
                        <div className="card-body text-center py-5">
                            <Loading />
                        </div>
                    </div>
                ) : usuario ? (
                    <FormUsuario usuario={usuario} />
                ) : (
                    <div
                        className="card shadow border-0"
                        style={{
                            borderRadius: 20
                        }}
                    >
                        <div className="card-body text-center py-5">
                            <h3 className="fw-bold">
                                Erro ao carregar usuário
                            </h3>

                            <p className="text-muted">
                                Não foi possível encontrar os dados desse usuário.
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    );
}