'use client'

import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function FormConsorcio({ consorcio }) {

    const [imagens, setImagens] = useState([]);
    const [salvando, setSalvando] = useState(false);

    const router = useRouter();

    const nome = useRef();
    const quantCotas = useRef();
    const valorPremio = useRef();
    const taxaAdm = useRef();
    const fundoReserva = useRef();
    const diasAssembleia = useRef();
    const dataInicio = useRef();
    const fotos = useRef();

    function carregarImagens() {
        let imgs = fotos.current.files;
        let aux = [];

        for (let i = 0; i < imgs.length; i++) {
            if (
                imgs[i].type.includes("jpg") ||
                imgs[i].type.includes("jpeg") ||
                imgs[i].type.includes("png")
            ) {
                aux.push(URL.createObjectURL(imgs[i]));
            }
        }

        setImagens(aux);
    }

    async function gravar(e) {
        e.preventDefault();

        if (
            nome.current.value === "" ||
            quantCotas.current.value === "" ||
            valorPremio.current.value === "" ||
            taxaAdm.current.value === "" ||
            fundoReserva.current.value === "" ||
            diasAssembleia.current.value === "" ||
            dataInicio.current.value === ""
        ) {
            toast.error("Preencha todos os campos");
            return;
        }

        if (Number(quantCotas.current.value) <= 0) {
            toast.error("A quantidade de cotas deve ser maior que zero");
            return;
        }

        if (Number(diasAssembleia.current.value) < 1 || Number(diasAssembleia.current.value) > 31) {
            toast.error("O dia da assembleia deve ser entre 1 e 31");
            return;
        }

        setSalvando(true);

        let formData = new FormData();

        formData.append("consorcioNome", nome.current.value);
        formData.append("consorcioQuantCotas", quantCotas.current.value);
        formData.append("consorcioValorPremio", valorPremio.current.value);
        formData.append("consorcioTaxaAdm", taxaAdm.current.value);
        formData.append("consorcioFundoReserva", fundoReserva.current.value);
        formData.append("consorcioDiaAssembleia", diasAssembleia.current.value);
        formData.append("consorcioDataInicio", dataInicio.current.value);

        if (fotos.current.files) {
            for (let i = 0; i < fotos.current.files.length; i++) {
                formData.append("imagens", fotos.current.files[i]);
            }
        }

        let resposta = await ApiClient.postFormData("consorcio", formData);

        setSalvando(false);

        if (resposta) {
            toast.success(resposta.msg);
            router.push("/sistema/consorcios");
        }
    }

    useEffect(() => {
        if (consorcio) {
            nome.current.value = consorcio.nome || "";
            quantCotas.current.value = consorcio.quantidadeCotas || "";
            valorPremio.current.value = consorcio.valorPremio || "";
            taxaAdm.current.value = consorcio.taxaAdm || "";
            fundoReserva.current.value = consorcio.fundoReserva || "";
            diasAssembleia.current.value = consorcio.diaAssembleia || "";
        }
    }, []);

    return (
        <div className="card shadow border-0" style={{ borderRadius: 20 }}>
            <div className="card-body p-4">

                <form onSubmit={gravar}>

                    <div className="row">

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">Nome do consórcio</label>
                            <input
                                ref={nome}
                                type="text"
                                className="form-control"
                                placeholder="Ex: Consórcio HB20"
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">Quantidade de cotas</label>
                            <input
                                ref={quantCotas}
                                type="number"
                                className="form-control"
                                placeholder="Ex: 60"
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">Valor do prêmio</label>
                            <input
                                ref={valorPremio}
                                type="number"
                                step="0.01"
                                className="form-control"
                                placeholder="Ex: 60000"
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">Taxa administrativa (%)</label>
                            <input
                                ref={taxaAdm}
                                type="number"
                                step="0.01"
                                className="form-control"
                                placeholder="Ex: 5"
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">Fundo de reserva (%)</label>
                            <input
                                ref={fundoReserva}
                                type="number"
                                step="0.01"
                                className="form-control"
                                placeholder="Ex: 2"
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">Dia da assembleia</label>
                            <input
                                ref={diasAssembleia}
                                type="number"
                                min="1"
                                max="31"
                                className="form-control"
                                placeholder="Ex: 10"
                            />
                        </div>

                        <div className="col-12 col-md-6 mb-3">
                            <label className="font-weight-bold">Data de início</label>
                            <input
                                ref={dataInicio}
                                type="date"
                                className="form-control"
                            />
                        </div>

                        <div className="col-12 mb-3">
                            <label className="font-weight-bold">Imagem do consórcio</label>

                            <input
                                onChange={carregarImagens}
                                ref={fotos}
                                className="form-control"
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png"
                            />

                            {imagens.length > 0 && (
                                <div className="d-flex flex-wrap gap-3 mt-3">
                                    {imagens.map((value, index) => (
                                        <img
                                            key={index}
                                            src={value}
                                            alt="Pré-visualização"
                                            style={{
                                                width: 150,
                                                height: 100,
                                                objectFit: "cover",
                                                borderRadius: 12,
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                        <button
                            type="submit"
                            disabled={salvando}
                            className="btn btn-primary mr-2"
                        >
                            {salvando ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check mr-2"></i>
                                    Confirmar
                                </>
                            )}
                        </button>

                        <Link href="/sistema/consorcios" className="btn btn-secondary">
                            Voltar
                        </Link>
                    </div>

                </form>

            </div>
        </div>
    );
}