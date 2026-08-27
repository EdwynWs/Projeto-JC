import FormUsuario from "@/app/components/formUsuario";
import Link from "next/link";

export default function CadastarPage() {
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
                        Cadastrar Usuário
                    </h1>

                    <p className="text-muted mb-0">
                        Preencha os dados para cadastrar um novo usuário.
                    </p>
                </div>

                <Link
                    href="/sistema/usuario"
                    className="btn btn-outline-primary"
                >
                    Voltar
                </Link>
            </div>

            <FormUsuario />
        </div>
    );
}