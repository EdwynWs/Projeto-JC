"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header({ usuario }) {

    const router = useRouter();

    const isAdmin =
        Number(usuario?.usu_per_id ?? usuario?.per_id ?? usuario?.perID) === 2;

    async function logout() {

        try {

            const response = await fetch(
                "http://localhost:5001/usuario/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (response.ok) {

                toast.success("Logout realizado com sucesso.");

                router.replace("/login");

            } else {

                toast.error("Não foi possível sair do sistema.");

            }

        } catch (error) {

            console.error(error);

            toast.error("Erro ao realizar logout.");

        }
    }

    return (
        <header className="sistema-header">

            <div className="header-title">

                <span className="header-title-small">
                    JCortiça Painéis Elétricos
                </span>

                <h1>
                    Sistema de Gerenciamento
                </h1>

            </div>


            <div className="header-user">

                <div className="header-user-info">

                    <strong>
                        {usuario?.usu_nome ?? usuario?.usuarioNome}
                    </strong>

                    <span>
                        {isAdmin
                            ? "Administrador"
                            : "Cliente"}
                    </span>

                </div>


                <div className="header-avatar">

                    <i className="fas fa-user"></i>

                </div>


                <button
                    className="header-logout"
                    onClick={logout}
                    title="Sair"
                >

                    <i className="fas fa-right-from-bracket"></i>

                </button>

            </div>

        </header>
    );
}