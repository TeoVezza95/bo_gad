import {GenericTable} from "@/components/GenericTable.tsx";
import {sacsWithoutSubregistrationAccountsColumns} from "@/components/GenericTableColumn.tsx";
import {SacsWithoutSubregistrationAccount} from "@/interfaces.ts";
import {useState} from "react";
import {sacsWithoutSubregistrationAccounts} from "@/services/sacs_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";


const SacsWithoutSubregistrationAccounts = () => {
    const [sacsWithoutSubregistrationAccount, setSacsWithoutSubregistrationAccount] = useState<SacsWithoutSubregistrationAccount[]>([]);
    // const [sacsWithoutSubregistrationAccountFilters, setSacsWithoutSubregistrationAccountFilters] = useState<z.infer<typeof sacsWithoutSubregistrationAccountFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    // useEffect(() => {
    //     handlePaginationChange(1, 10)
    // }, [sacsWithoutSubregistrationAccountFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        // sacsWithoutSubregistrationAccounts({sacsWithoutSubregistrationAccountFilters}, currentPage, pageSize)
        sacsWithoutSubregistrationAccounts({}, currentPage, pageSize)
            .then((response: {
                accounts: SacsWithoutSubregistrationAccount[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setSacsWithoutSubregistrationAccount(response.accounts);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in sacsWithoutSubregistrationAccounts:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    // const handleFilter = (
    //     filters: Record<string, unknown>
    // ) => {
    //     console.log("Filtering data sacsWithoutSubregistrationAccounts:", filters);
    //     setSacsWithoutSubregistrationAccountFilters(filters as z.infer<typeof sacsWithoutSubregistrationAccountFilterSchema>);
    // };

    return (
        <>
            {/*<GenericFilters<z.infer<typeof sacsWithoutSubregistrationAccountFilterSchema>>*/}
            {/*    schema={sacsWithoutSubregistrationAccountFilterSchema}*/}
            {/*    filters={sacsWithoutSubregistrationAccountFilters}*/}
            {/*    mapping={statusMapping}*/}
            {/*    filterFields={sacsWithoutSubregistrationAccountFilterFields}*/}
            {/*    onFilter={(values) => handleFilter(values)}*/}
            {/*/>*/}
            <GenericTable data={sacsWithoutSubregistrationAccount} columns={sacsWithoutSubregistrationAccountsColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default SacsWithoutSubregistrationAccounts;