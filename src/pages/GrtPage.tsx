import Gev from "@/components/Grt/Gev.tsx";
import {useSearchParams} from "react-router-dom";
import Ldt from "@/components/Grt/Ldt.tsx";
import Lor from "@/components/Grt/Lor.tsx";

const GrtPage = () => {
    const [searchParams] = useSearchParams();
    const param = searchParams.get("param");

    const componentsMap: { [key: string]: JSX.Element } = {
        gev: <Gev/>,
        ldt: <Ldt/>,
        lotto: <Lor/>
    };

    const renderedComponent =
        componentsMap[param || ""] ||
        <div>
            <h2>404 - Pagina non trovata</h2>
            <p>Il parametro specificato non corrisponde a nessuna pagina disponibile.</p>
        </div>;

    // const formattedDate = new Date().toLocaleString('it-IT', {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit',
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit',
    //     hour12: false, // evita il formato 12h (AM/PM)
    // } );


    // const gevData = [
    //     {id: "173651650136123", contoGioco: "109436813811", dataInizio: formattedDate, dataFine: formattedDate, status: "Vincente", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136124", contoGioco: "109436813451", dataInizio: formattedDate, dataFine: formattedDate, status: "In Attesa", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136125", contoGioco: "109436813810", dataInizio: formattedDate, dataFine: formattedDate, status: "Vincente", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136126", contoGioco: "109436813891", dataInizio: formattedDate, dataFine: formattedDate, status: "Rimborsata", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136127", contoGioco: "109436813842", dataInizio: formattedDate, dataFine: formattedDate, status: "Perdente", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136128", contoGioco: "109436813263", dataInizio: formattedDate, dataFine: formattedDate, status: "In Attesa", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136129", contoGioco: "109456813822", dataInizio: formattedDate, dataFine: formattedDate, status: "Vincente", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136130", contoGioco: "109436813625", dataInizio: formattedDate, dataFine: formattedDate, status: "Rimborsata", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136131", contoGioco: "109436813841", dataInizio: formattedDate, dataFine: formattedDate, status: "Vincente", costoBiglietto:"€ 5,00"},
    //     {id: "173651650136132", contoGioco: "109436813220", dataInizio: formattedDate, dataFine: formattedDate, status: "Perdente", costoBiglietto:"€ 5,00"},
    // ]

    return (
        <>
            <div className="size-full">GRT Page - Parametro: {param}</div>
            {renderedComponent}
            {/*<div className="w-[50%] mx-auto">*/}
            {/*    <Chart/>*/}
            {/*</div>*/}
        </>
    )
}

export default GrtPage
