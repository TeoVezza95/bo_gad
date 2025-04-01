import {CardsContainer} from "@/components/CardsContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import LorTransactions from "@/components/Grt/Lor/LorTransactions.tsx";
import LorRegistryKeys from "@/components/Grt/Lor/LorRegistryKeys.tsx";
import LorContests from "@/components/Grt/Lor/LorContests.tsx";
import LorWinningLists from "@/components/Grt/Lor/LorWinningLists.tsx";

const Lor = () => {

    const data = [
        {title: "Transazioni", value: "5600"},
        {title: "Completate", value: "2300"},
        {title: "Annullate", value: "650"},
        {title: "Pending", value: "4650"},
    ];

    return (
        <>
            <CardsContainer items={data} cardClass={"bg-[#f58220] text-white"}/>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transazioni</TabsTrigger>
                    <TabsTrigger value="registryKeys">Conti Registrati</TabsTrigger>
                    <TabsTrigger value="contests">Concorsi</TabsTrigger>
                    <TabsTrigger value="winningLists">Giocate Vincenti</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <LorTransactions/>
                </TabsContent>
                <TabsContent value="registryKeys">
                    <LorRegistryKeys/>
                </TabsContent>
                <TabsContent value="contests">
                    <LorContests/>
                </TabsContent>
                <TabsContent value="winningLists">
                    <LorWinningLists/>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Lor;
