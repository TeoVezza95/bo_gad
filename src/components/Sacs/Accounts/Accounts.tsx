import {CardsContainer} from "@/components/CardsContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import SelfExcludedAccounts from "@/components/Sacs/Accounts/SelfExcludedAccounts.tsx";
import SacsDormantAccounts from "@/components/Sacs/Accounts/DormantAccounts.tsx";
import SacsWithoutSubregistrationAccounts from "@/components/Sacs/Accounts/WithoutSubregistratioAccounts.tsx";

const Accounts = () => {

    const data = [
        {title: "Transazioni", value: "51500"},
        {title: "Completate", value: "14000"},
        {title: "Annullate", value: "1300"},
        {title: "Pending", value: "450"},
    ];

    return (
        <>
            <CardsContainer items={data} cardClass={"bg-sky-300 text-gadBlue"}/>
            <Tabs defaultValue="selfExcludedAccounts">
                <TabsList>
                    <TabsTrigger value="selfExcludedAccounts">AutoEsclusi</TabsTrigger>
                    <TabsTrigger value="dormantAccounts">Dormienti</TabsTrigger>
                    <TabsTrigger value="withoutsSubregistrationAccounts">Senza Subregistrazione</TabsTrigger>
                </TabsList>
                <TabsContent value="selfExcludedAccounts">
                    <SelfExcludedAccounts/>
                </TabsContent>
                <TabsContent value="dormantAccounts">
                    <SacsDormantAccounts/>
                </TabsContent>
                <TabsContent value="withoutsSubregistrationAccounts">
                    <SacsWithoutSubregistrationAccounts/>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Accounts;
