"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { useRouter } from "next/navigation";

const UserContext = createContext(null);

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function UserProvider({ children }) {

    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    async function carregarUsuario() {

        try {

            setCarregando(true);

            const response = await fetch(
                `${API_URL}/usuario/logado`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {

                setUsuario(null);

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {
                    router.replace("/login");
                }

                return;
            }

            const dados = await response.json();

            setUsuario(dados);

        } catch (error) {

            console.error(
                "Erro ao carregar usuário:",
                error
            );

            setUsuario(null);

            router.replace("/login");

        } finally {

            setCarregando(false);

        }
    }

    useEffect(() => {

        carregarUsuario();

    }, []);

    function ehAdmin() {

        if (!usuario) {
            return false;
        }

        return Number(usuario.per_id) === 2;
    }

    function ehCliente() {

        if (!usuario) {
            return false;
        }

        return Number(usuario.per_id) === 1;
    }

    async function logout() {

        try {

            await fetch(
                `${API_URL}/usuario/logout`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

        } catch (error) {

            console.error(
                "Erro ao fazer logout:",
                error
            );

        } finally {

            setUsuario(null);

            router.replace("/login");

        }
    }

    return (
        <UserContext.Provider
            value={{
                usuario,
                carregando,
                ehAdmin,
                ehCliente,
                logout,
                recarregarUsuario: carregarUsuario
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUsuario() {

    const contexto = useContext(UserContext);

    if (!contexto) {

        throw new Error(
            "useUsuario deve ser utilizado dentro de UserProvider"
        );

    }

    return contexto;
}