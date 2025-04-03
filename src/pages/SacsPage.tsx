import {useParams} from "react-router-dom";

import AperturaGiuridica from "@/components/Sacs/AperturaGiuridica.tsx";

const SacsPage = () => {
    const { param } = useParams<{ param: string }>();


    const componentsMap: { [key: string]: JSX.Element } = {
        aperGiur: <AperturaGiuridica/>,
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
