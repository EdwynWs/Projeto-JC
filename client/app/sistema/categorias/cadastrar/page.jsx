"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUsuario } from "../../../context/userContext";
import ApiClient from "@/utils/apiClient";

export default function CadastrarCategoriaPage() {

    const router = useRouter();

    const { ehAdmin } = useUsuario();

    const [salvando, setSalvando] = useState(false);

    const nome = useRef(null);
    const descricao = useRef(null);
    const ativo = useRef(null);

    if (!ehAdmin()) {

        return (
            <div className="sistema-empty">

                <div className="sistema-empty-icon">
                    <i className="fas fa-lock"></i>
                </div>

                <h2>Acesso restrito</h2>

                <p>
                    Apenas administradores podem
                    cadastrar categorias.
                </p>

                <Link
                    href="/sistema/home"
                    className="btn-sistema"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar ao dashboard
                </Link>

            </div>
        );
    }

    async function cadastrar(e) {

        e.preventDefault();

        const catNome = nome.current.value.trim();

        if (!catNome) {

            toast.error(
                "O nome da categoria é obrigatório."
            );

            return;
        }

        setSalvando(true);

        const resposta = await ApiClient.post(
            "categoria/cadastrar",
            {
                catNome,
                catDescricao: descricao.current.value.trim(),
                catAtivo: ativo.current.checked
            }
        );

        setSalvando(false);

        if (resposta) {

            toast.success(
                resposta.msg ||
                "Categoria cadastrada com sucesso!"
            );

            router.push("/sistema/categorias");

        }
    }

    return (
        <div className="sistema-page">

            <div className="sistema-page-header">

                <div>

                    <span className="sistema-page-kicker">
                        ADMINISTRAÇÃO
                    </span>

                    <h1>
                        Nova categoria
                    </h1>

                    <p>
                        Cadastre uma nova categoria de
                        equipamento para organizar os manuais.
                    </p>

                </div>

                <Link
                    href="/sistema/categorias"
                    className="btn-sistema-secondary"
                >
                    <i className="fas fa-arrow-left"></i>
                    Voltar
                </Link>

            </div>

            <form
                className="sistema-form-card"
                onSubmit={cadastrar}
            >

                <div className="sistema-form-row">

                    <div className="sistema-form-group">

                        <label htmlFor="catNome">
                            Nome da categoria
                        </label>

                        <input
                            id="catNome"
                            ref={nome}
                            type="text"
                            placeholder="Ex: Coletor de Ovos"
                            maxLength={120}
                        />

                    </div>

                </div>

                <div className="sistema-form-row">

                    <div className="sistema-form-group">

                        <label htmlFor="catDescricao">
                            Descrição
                        </label>

                        <textarea
                            id="catDescricao"
                            ref={descricao}
                            placeholder="Breve descrição sobre o equipamento ou sistema (opcional)"
                            maxLength={255}
                        />

                        <p className="sistema-form-hint">
                            Aparece como subtítulo da categoria
                            no dashboard e na listagem de manuais.
                        </p>

                    </div>

                </div>

                <div className="sistema-form-check">

                    <input
                        id="catAtivo"
                        ref={ativo}
                        type="checkbox"
                        defaultChecked
                    />

                    <label htmlFor="catAtivo">
                        Categoria ativa (visível para os clientes)
                    </label>

                </div>

                <div className="sistema-form-actions">

                    <button
                        type="submit"
                        className="btn-sistema"
                        disabled={salvando}
                    >
                        {salvando ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check"></i>
                                Cadastrar categoria
                            </>
                        )}
                    </button>

                    <Link
                        href="/sistema/categorias"
                        className="btn-sistema-secondary"
                    >
                        Cancelar
                    </Link>

                </div>

            </form>

        </div>
    );
}
