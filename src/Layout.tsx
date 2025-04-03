import { Outlet } from "react-router-dom"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-full">
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            {/* Altri elementi comuni, ad esempio breadcrumb */}
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 size-full">
                        {/* Qui va l'Outlet, che inietterà la pagina specifica in base alla rotta */}
                        <Outlet />
                    </div>
                </SidebarInset>
            </main>
        </SidebarProvider>
    )
}
