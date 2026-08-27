import FormConsorcio from "@/app/components/formCadastrarConsorcio";
import Link from "next/link";

export default function CadastrarPage() {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h1 className="h3 mb-1" style={{ color: "#1f3c88", fontWeight: 800 }}>
                        Cadastrar Consórcio
                    </h1>
                    <p className="text-muted mb-0">
                        Preencha as informações para criar um novo grupo de consórcio.
                    </p>
                </div>

                <Link href="/sistema/consorcios" className="btn btn-outline-primary">
                    Voltar
                </Link>
            </div>

            <FormConsorcio />
        </div>
    );
}