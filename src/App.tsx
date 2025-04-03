import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Layout from "@/Layout";
import "./App.css";
// Pagine
import HomePage from "@/pages/HomePage";
import GrtPage from "@/pages/GrtPage.tsx";
import SacsPage from "@/pages/SacsPage.tsx";
import ActPage from "@/pages/ActPage.tsx";
import {LoginPage} from "@/pages/LoginPage.tsx"; // Importa la pagina di login
import {AuthProvider, AuthContext} from "@/context/AuthContext";
import {useContext} from "react";

function PrivateRoute({children}: { children: JSX.Element }) {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("PrivateRoute must be used within an AuthProvider");
    }
    const {isAuthenticated, loading} = context;
    if (loading) {
        return <div>Loading...</div>; // Puoi sostituire con uno spinner
    }
    return isAuthenticated ? children : <Navigate to="/login" replace/>;
}

// 🔹 Gestione fallback per qualsiasi rotta sconosciuta
function FallbackRoute() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("FallbackRoute must be used within an AuthProvider");
    }
    const {isAuthenticated, loading} = context;
    if (loading) {
        return <div>Loading...</div>; // Puoi aggiungere un'animazione di caricamento
    }
    return isAuthenticated ? <Navigate to="/bo-gad" replace/> : <Navigate to="/login" replace/>;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rotta per il Login */}
                    <Route path="/login" element={<LoginPage/>}/>

                    {/* Rotta di fallback globale */}
                    <Route path="*" element={<FallbackRoute/>}/>

                    {/* Rotta con Layout e Pagine Protette */}
                    <Route path="/bo-gad"
                           element={
                               <PrivateRoute>
                                   <Layout/>
                               </PrivateRoute>
                           }>
                        <Route index element={<HomePage/>}/>
                        <Route path="/bo-gad/grt/:param" element={<GrtPage/>}/>
                        <Route path="/bo-gad/sacs/:param" element={<SacsPage/>}/>
                        <Route path="/bo-gad/act/" element={<ActPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
