import {useSearchParams} from "react-router-dom";

import AperturaGiuridica from "@/components/Sacs/AperturaGiuridica.tsx";

const SacsPage = () => {
    const [searchParams] = useSearchParams();
    const param = searchParams.get("param");

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
            {/*<div className="w-[50%] mx-auto">*/}
            {/*    <Chart/>*/}
            {/*</div>*/}
        </>
    )
}

export default SacsPage
