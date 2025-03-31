import {useNavigate} from "react-router-dom"
import {ChevronDown, Home, Users, Ruler, Tickets, LogOut} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@radix-ui/react-collapsible"
import mylLogo from '../assets/logo-MYLPlay.svg'
import {Button} from "@/components/ui/button.tsx";
import {AuthContext} from "@/context/AuthContext.tsx";
import {useContext} from "react";
// import gevLogo from '../assets/logo-GEV.svg'
// import ldtLogo from '../assets/logo-LDT.svg'
// import lottoLogo from '../assets/logo-LOTTO.svg'
// import virtualLogo from '../assets/logo-VIRTUAL.png'


const items = [
    {
        title: "Home",
        url: "home",
        icon: Home,
    },
    {
        title: "GRT",
        url: "bo-gad/grt",
        icon: Tickets,
        submenu: [["Gratta e Vinci", "gev"], ["Lotteria Italia", "ldt"], ["Lotto", "lotto"], ["Virtuali", "virtual"]],
    },
    {
        title: "SACS",
        url: "bo-gad/sacs",
        icon: Ruler,
        param: "sacs",
        submenu: [["Apertura Giuridica", "aperGiur"], ["Riepilogo Movimentazioni", "riepMov"], ["Riepilogo Servizio", "riepServ"], ["Conti Autoesclusi", "contiAutoExc"], ["Conti Dormienti", "contiDorm"], ["Conti Senza Subregistrazione", "contiSenzaSub"]],
    },
    {
        title: "ACT",
        url: "bo-gad/act",
        icon: Users,
    },
]

// const getLogo = (name: string) => {
//     if (name === "GEV") {
//         return <div className="flex items-center">
//             <img src={gevLogo}
//                  className="w-8 mr-2" alt={"Gev logo"}/>
//             <span className="text-gadBlue text-sm">{name}</span>
//         </div>
//     }else if(name === "LDT") {
//         return <div className="flex items-center">
//             <img src={ldtLogo}
//                  className="w-8 mr-2" alt={"Ldt logo"}/>
//             <span className="text-gadBlue text-sm">{name}</span>
//         </div>
//     }else if(name === "LOTTO") {
//         return <div className="flex items-center">
//             <img src={lottoLogo}
//                  className=" w-8 mr-2" alt={"Lotto logo"}/>
//             <span className="text-gadBlue text-sm">{name}</span>
//         </div>
//     }else if(name === "VIRTUAL") {
//         return <div className="flex items-center">
//             <img src={virtualLogo}
//                  className="w-8 mr-2" alt={"Virtual logo"}/>
//             <span className="text-gadBlue text-sm">{name}</span>
//         </div>
//     }
//     return null
// }

export function AppSidebar() {
    // React Router hook per navigare:
    const navigate = useNavigate()
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }
    const { logout } = authContext;

    // La tua funzione di navigazione
    const handleClickNavigate = (path: string, param?: string) => {
        // Esempio: se param è una query o un path param, decidi come comporlo
        // Semplice: navigate("/" + path)
        // Con query param: navigate(`/${path}?param=${param}`)
        // O rotta dinamica: navigate(`/${path}/${param}`)
        // Scegli in base a come hai definito le rotte
        if (param) {
            navigate(`/${path}?param=${param}`)
        } else {
            navigate(`/${path}`)
        }
    }

    return (
        <Sidebar>
            <SidebarContent className="h-full">
                <SidebarGroup className="flex-1">
                    <SidebarGroupLabel className="flex items-center justify-evenly my-8">
                        <img src={mylLogo} className="h-full" alt="React logo"/>
                        <span className="text-gadBlue font-bold text-[0.9rem]">GAD: BackOffice</span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <Collapsible key={item.title} defaultOpen={false}
                                             className="group/collapsible font-medium text-gadBlue">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton asChild>
                                                <div
                                                    className="flex items-center cursor-pointer"
                                                    onClick={() => {
                                                        // Se NON c'è un submenu, navighiamo direttamente
                                                        if (!item.submenu) {
                                                            handleClickNavigate(item.url, item.param)
                                                        }
                                                    }}
                                                >
                                                    <item.icon className="mr-2"/>
                                                    <span>{item.title}</span>
                                                    {item.submenu && <ChevronDown className="ml-auto h-4 w-4"/>}
                                                </div>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>

                                        {/* Se c'è un submenu, collassabile */}
                                        {item.submenu && (
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.submenu.map((subItem, index) => (
                                                        <SidebarMenuSubItem key={index} className="my-1.5">
                                                            <div
                                                                className="cursor-pointer"
                                                                onClick={() => {
                                                                    handleClickNavigate(item.url, subItem[1])
                                                                }}
                                                            >
                                                                <span>{subItem[0]}</span>
                                                            </div>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        )}
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarFooter>
                    <Button className="w-1/2 bg-gadBlue mx-auto mb-2" onClick={logout}><LogOut/>logOut</Button>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    )
}
