import {CardsContainer} from "@/components/CardsContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import Ewl from "@/components/Act/Ewl.tsx";
import Onp from "@/components/Act/Onp.tsx";
import Bonus from "@/components/Act/Bonus.tsx";
import Storni from "@/components/Act/Storni.tsx";


const ActPage = () => {

    const data = [
        {title: "Giocate", value: "431.500"},
        {title: "BounceRate", value: "53%"},
        {title: "Registrazioni oggi", value: "1.355"},
        {title: "Visitatori", value: "45.000"},
    ]

    return (
        <>
            <div className="size-full">
                ACT
            </div>
            <CardsContainer items={data}/>
            <Tabs defaultValue="bonus">
                <TabsList>
                    <TabsTrigger value="bonus">Bonus</TabsTrigger>
                    <TabsTrigger value="storni">Storni</TabsTrigger>
                    <TabsTrigger value="onp">Coda - ONP</TabsTrigger>
                    <TabsTrigger value="ewl">Coda - EWL</TabsTrigger>
                </TabsList>
                <TabsContent value="bonus">
                    <Bonus/>
                </TabsContent>
                <TabsContent value="storni">
                    <Storni/>
                </TabsContent>
                <TabsContent value="onp">
                    <Onp/>
                </TabsContent>
                <TabsContent value="ewl">
                    <Ewl/>
                </TabsContent>
            </Tabs>
        </>
    )
}

export default ActPage
