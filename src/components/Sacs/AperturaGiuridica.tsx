import {GenericForm} from "@/components/GenericForm.tsx";
import {z} from "zod";
import {FilterField} from "@/interfaces.ts";
import {useState} from "react";

// Schema per le registry keys
const aperturaGiuridicaFilterSchema = z.object({
    contrattoContoGioco: z.string().nonempty("Il Contratto Conto Gioco è obbligatorio"),
    partitaIva: z.string().nonempty("La Partita IVA è obbligatoria"),
    email: z.string().email().nonempty("L'Email è obbligatoria"),
    pseudonimo: z.string().nonempty("Il Pseudonimo è obbligatorio"),
    ragioneSociale: z.string().nonempty("La Ragione Sociale è obbligatoria"),
    cap: z.string().nonempty("Il CAP è obbligatorio"),
    indirizzo: z.string().nonempty("L'Indirizzo è obbligatorio"),
    provincia: z.string().nonempty("La Provincia è obbligatoria"),
});

// Definizione dei campi filtro per le registry keys
const aperturaGiuridicaFilterFields: FilterField<z.infer<typeof aperturaGiuridicaFilterSchema>>[] = [
    {field: "contrattoContoGioco", label: "Contratto Conto Gioco", type: "text"},
    {field: "partitaIva", label: "Partita IVA", type: "text"},
    {field: "email", label: "Email", type: "text"},
    {field: "pseudonimo", label: "Pseudonimo", type: "text"},
    {field: "ragioneSociale", label: "Ragione Sociale", type: "text"},
    {field: "cap", label: "Cap", type: "text"},
    {field: "indirizzo", label: "Indirizzo", type: "text"},
    {field: "provincia", label: "Provincia", type: "text"},
];

const AperturaGiuridica = () => {
    const [aperturaGiuridicaFilters, setAperturaGiuridicaFilters] = useState<z.infer<typeof aperturaGiuridicaFilterSchema>>({
        contrattoContoGioco: "",
        partitaIva: "",
        email: "",
        pseudonimo: "",
        ragioneSociale: "",
        cap: "",
        indirizzo: "",
        provincia: "",
    });


    const handleSubmit = (
        type: "transactions" | "aperturaGiuridica",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "aperturaGiuridica") {
            setAperturaGiuridicaFilters(filters as z.infer<typeof aperturaGiuridicaFilterSchema>);
        }
    };

    return (
        <>
            <div className="aperturaGiuridica">Apertura Giuridica</div>
            <GenericForm<z.infer<typeof aperturaGiuridicaFilterSchema>>
                schema={aperturaGiuridicaFilterSchema}
                filters={aperturaGiuridicaFilters}
                filterFields={aperturaGiuridicaFilterFields}
                buttonName={"Registra"}
                onSubmit={(values) => handleSubmit("aperturaGiuridica", values)}
            />
        </>
    )
}

export default AperturaGiuridica;