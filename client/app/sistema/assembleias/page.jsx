"use client";

import { useEffect, useState } from "react";
import api from "@/utils/apiClient";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function AssembleiaPage() {
    const searchParams = useSearchParams();
    const conId = searchParams.get("consorcio");

    const [assembleias, setAssembleias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState(null);

    async function carregarUsuario() {

        try {

            const response = await api.get("usuario/logado");
            setUsuario(response);

        } catch (error) {

            console.error(error);

            toast.error("Erro ao carregar usuário");
        }
    }

    async function carregarAssembleias() {

        try {

            setLoading(true);

            const response = await api.get(
                `assembleia/consorcio/${conId}`
        );

            setAssembleias(response || []);

        }
        catch (error) {

            console.error(error);

            toast.error("Erro ao carregar assembleias");
        }
        finally {

            setLoading(false);
        }
    }

    async function realizarAssembleia(assId) {

        try {

            const validar = await api.get(
                `assembleia/${assId}/pode-realizar`
            );

           if (!validar) {
                    return;
                }

                if (!validar.pode) {
                
                    toast.error(
                        `Faltam ${validar.faltam || 0} pagamentos`
                    );
                    return;
                }

            const response = await api.post(
                `assembleia/${assId}/realizar`
            );

            toast.success(response.msg);

            carregarAssembleias();

        }
        catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.msg ||
                "Erro ao realizar assembleia"
            );
        }
    }

    useEffect(() => {

        async function init() {

            await carregarUsuario();
        }

        init();

    }, []);

    useEffect(() => {

    if (usuario) {
        carregarAssembleias();
    }

}, [usuario]);

    if (!usuario) {

        return (
            <div className="container-fluid py-4">
                Carregando...
            </div>
        );
    }

    return (

        <div
            className="container-fluid py-4"
            style={{
                minHeight: "100vh",
                backgroundColor: "#f4f6fb"
            }}
        >

            <div className="mb-4">

                <h1
                    style={{
                        fontSize: "52px",
                        fontWeight: "300",
                        color: "#5f6b7a"
                    }}
                >
                    Assembleias
                </h1>

                <p
                    style={{
                        color: "#8b95a7"
                    }}
                >
                    Gerencie as assembleias do consórcio.
                </p>

            </div>

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
                            fontWeight: "700",
                            color: "#1e3a8a"
                        }}
                    >
                        Lista de Assembleias
                    </h3>

                    {
                        loading
                        ?
                        <div>
                            Carregando...
                        </div>
                        :
                        <div className="table-responsive">

                            <table className="table align-middle">

                                <thead>

                                    <tr>

                                        <th>#</th>
                                        <th>Data</th>
                                        <th>Status</th>
                                        <th>Cota Contemplada</th>
                                        <th>Ações</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        Array.isArray(assembleias) &&
                                        assembleias.length > 0
                                        ?
                                        assembleias.map((item) => (

                                            <tr key={item.ass_id}>

                                                <td>
                                                    {item.ass_numero}
                                                </td>

                                                <td>
                                                    {
                                                        new Date(
                                                            item.ass_data
                                                        ).toLocaleDateString("pt-BR")
                                                    }
                                                </td>

                                                <td>

                                                    {
                                                        item.cot_id
                                                        ?
                                                        <span className="badge bg-success">
                                                            REALIZADA
                                                        </span>
                                                        :
                                                        <span className="badge bg-warning text-dark">
                                                            PENDENTE
                                                        </span>
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        item.cot_id
                                                        ?
                                                        `Cota ${item.cot_id}`
                                                        :
                                                        "-"
                                                    }

                                                </td>

                                                <td>

                                                    {
                                                        !item.cot_id
                                                        &&
                                                        <button
                                                            onClick={() =>
                                                                realizarAssembleia(
                                                                    item.ass_id
                                                                )
                                                            }
                                                            className="btn btn-primary"
                                                            style={{
                                                                borderRadius: "12px",
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            Realizar
                                                        </button>
                                                    }

                                                </td>

                                            </tr>

                                        ))
                                        :
                                        <tr>

                                            <td colSpan="5">

                                                Nenhuma assembleia encontrada.

                                            </td>

                                        </tr>
                                    }

                                </tbody>

                            </table>

                        </div>
                    }

                </div>

            </div>

        </div>
    );
}