import {useParams} from "react-router-dom";

import AperturaGiuridica from "@/components/Sacs/AperturaGiuridica.tsx";
import MovementsSummary from "@/components/Sacs/MovementsSummary.tsx";
import ServiceOperations from "@/components/Sacs/ServiceOperations.tsx";
import Accounts from "@/components/Sacs/Accounts/Accounts.tsx";

const SacsPage = () => {
    const { param } = useParams<{ param: string }>();


    const componentsMap: { [key: string]: JSX.Element } = {
        aperGiur: <AperturaGiuridica/>,
        riepMov: <MovementsSummary/>,
        riepServ:<ServiceOperations/>,
        conti: <Accounts/>
    };

    const renderedComponent =
        componentsMap[param || ""] ||
        <div>
            <h2>404 - Pagina non trovata</h2>
            <p>Il parametro specificato non corrisponde a nessuna pagina disponibile.</p>
        </div>;

    return (
        <>
            <div className="size-full">GRT Page - Parametro: {param}</div>
            {renderedComponent}
        </>
    )
}

export default SacsPage
