import FormCriarUsuario from "@/app/components/login/formCriarUsuario";
import "./criarConta.css";

export default function CadastarPage() {
    return (
        <div className="cadastro-container">
            <div className="cadastro-card">
                <h1 className="cadastro-title">
                    Cadastrar Usuário
                </h1>

                <FormCriarUsuario />
            </div>
        </div>
    );
}