import Header from "./components/landing/header";
import Hero from "./components/landing/hero";
import Beneficios from "./components/landing/beneficios";
import Funcionamento from "./components/landing/funcionamento";
import Planos from "./components/landing/planos";
import Cta from "./components/landing/cta";
import Footer from "./components/landing/footer";

export default function HomePage(){
    return(
        <>
            <Header />
            <Hero />
            <Beneficios />
            <Funcionamento />
            <Planos />
            <Cta />
            <Footer />
        </>
    )
}