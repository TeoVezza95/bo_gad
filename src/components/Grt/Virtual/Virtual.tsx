import {CardsContainer} from "@/components/CardsContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import VirtualTransactions from "@/components/Grt/Virtual/VirtualTransactions.tsx";
const Virtual = () => {

    const data = [
        {title: "Transazioni", value: "11500"},
        {title: "Completate", value: "11400"},
        {title: "Annullate", value: "130"},
        {title: "Pending", value: "40"},
    ];

    return (
        <>
            <CardsContainer items={data} cardClass={"bg-red-300 text-gadBlue"}/>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transazioni</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <VirtualTransactions/>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Virtual;
