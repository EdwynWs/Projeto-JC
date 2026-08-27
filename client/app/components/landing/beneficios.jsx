export default function Beneficios() {
    return (
        <section className="py-5 bg-light" id="beneficios">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">Vantagens do Plataforma</h2>
                    <p className="section-subtitle">
                         Uma forma moderna, segura e organizada de acessar os manuais dos painéis elétricos
                    </p>
                </div>

                <div className="row g-4">
                    {[
                        ["fa-solid fa-folder-open","Manuais Organizados","Encontre os manuais dos painéis elétricos de forma rápida e organizada."],
                        ["fa-solid fa-magnifying-glass", "Busca Rápida", "Localize facilmente os manuais através de categorias e informações do painel."],
                        ["fa-solid fa-file-pdf", "Arquivos em PDF", "Acesse e baixe os manuais técnicos diretamente pela plataforma."],
                        ["fa-solid fa-cloud", "Acesso Online", "Consulte seus manuais de qualquer lugar, sem precisar armazenar os arquivos localmente."]
                    ].map((item, index) => (
                        <div className="col-12 col-md-6 col-lg-3" key={index}>
                            <div className="card feature-card p-4 h-100">
                                <div className="icon-box">
                                    <i className={item[0]}></i>
                                </div>
                                <h4 className="fw-bold">{item[1]}</h4>
                                <p className="text-muted mb-0">{item[2]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}