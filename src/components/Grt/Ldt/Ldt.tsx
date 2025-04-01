import {CardsContainer} from "@/components/CardsContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import LdtTransactions from "@/components/Grt/Ldt/LdtTransactions.tsx";
import LdtRegistryKeys from "@/components/Grt/Ldt/LdtRegistryKeys.tsx";
import LdtContests from "@/components/Grt/Ldt/LdtContests.tsx";

const Ldt = () => {

    const data = [
        {title: "Transazioni", value: "4500"},
        {title: "Completate", value: "1200"},
        {title: "Annullate", value: "100"},
        {title: "Pending", value: "410"},
    ];

    return (
        <>
            <CardsContainer items={data} cardClass={"bg-gadBlue text-yellow-300"}/>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transazioni</TabsTrigger>
                    <TabsTrigger value="registryKeys">Conti Registrati</TabsTrigger>
                    <TabsTrigger value="contests">Concorsi</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <LdtTransactions/>
                </TabsContent>
                <TabsContent value="registryKeys">
                    <LdtRegistryKeys/>
                </TabsContent>
                <TabsContent value="contests">
                    <LdtContests/>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Ldt;
