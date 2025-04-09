import {Outlet} from "react-router-dom"
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import {Separator} from "@/components/ui/separator"
import {NavUser} from "@/components/ui/nav-user.tsx";

export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <main className="w-full h-full p-2 bg-sidebar">
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
                        {/* Contenitore a sinistra */}
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1"/>
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            {/* eventuali altri elementi (es. breadcrumbs) */}
                        </div>
                        {/* Contenitore a destra */}
                        <div className="w-[200px]">
                            <NavUser user={{name: "test", email: "test@test", avatar: "test"}}/>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 size-full my-2">
                        {/* Qui va l'Outlet, che inietterà la pagina specifica in base alla rotta */}
                        <Outlet/>
                    </div>
                </SidebarInset>
            </main>
        </SidebarProvider>
    )
}
