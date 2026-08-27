'use client'

import { createContext, useEffect, useState } from "react";
import Loading from "../components/loading";
import ApiClient from "../../utils/apiClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregarUsuario() {
        try {
            const usuarioSalvo = localStorage.getItem("usuario");

            if (usuarioSalvo) {
                setUsuario(JSON.parse(usuarioSalvo));
            }

            const resposta = await ApiClient.get("usuario/logado");

            if (resposta) {
                const usuarioLogado = resposta.usuario ?? resposta;

                setUsuario(usuarioLogado);
                localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
            }
        } catch (error) {
            setUsuario(null);
            localStorage.removeItem("usuario");
        }

        setLoading(false);
    }

    function limparUsuario() {
        setUsuario(null);
        localStorage.removeItem("usuario");
    }

    useEffect(() => {
        carregarUsuario();
    }, []);

    return (
        <UserContext.Provider value={{
            usuario,
            setUsuario,
            carregarUsuario,
            limparUsuario
        }}>
            {loading ? <Loading /> : children}
        </UserContext.Provider>
    );
};

export default UserContext;