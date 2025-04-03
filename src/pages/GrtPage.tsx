import { useParams } from "react-router-dom";
import Gev from "@/components/Grt/Gev/Gev.tsx";
import Ldt from "@/components/Grt/Ldt/Ldt.tsx";
import Lor from "@/components/Grt/Lor/Lor.tsx";

const GrtPage = () => {
    const { param } = useParams<{ param: string }>();

    const componentsMap: { [key: string]: JSX.Element } = {
        gev: <Gev />,
        ldt: <Ldt />,
        lotto: <Lor />,
    };

    const renderedComponent =
        componentsMap[param || ""] || (
            <div>
                <h2>404 - Pagina non trovata</h2>
                <p>
                    Il parametro specificato non corrisponde a nessuna pagina disponibile.
                </p>
            </div>
        );

    return (
        <>
            <div className="size-full">GRT Page - Parametro: {param}</div>
            {renderedComponent}
        </>
    );
};

export default GrtPage;
