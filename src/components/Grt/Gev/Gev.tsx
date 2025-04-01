import {CardsContainer} from "@/components/CardsContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import GevTransactions from "@/components/Grt/Gev/GevTransactions.tsx";
import GevRegistryKeys from "@/components/Grt/Gev/GevRegistryKeys.tsx";

const Gev = () => {

    const data = [
        {title: "Transazioni", value: "51500"},
        {title: "Completate", value: "14000"},
        {title: "Annullate", value: "1300"},
        {title: "Pending", value: "450"},
    ];

    return (
        <>
            <CardsContainer items={data} cardClass={"bg-yellow-300 text-gadBlue"}/>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transazioni</TabsTrigger>
                    <TabsTrigger value="registryKeys">Conti Registrati</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <GevTransactions/>
                </TabsContent>
                <TabsContent value="registryKeys">
                    <GevRegistryKeys/>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Gev;
