import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { App as AntdApp } from "antd";
import { NotificationContext } from "./context/NotificationContext";
import GifLoader from "./components/GifLoader";
import LayoutAuth from "./components/layouts/LayoutAuth";
import LayoutBase from "./components/layouts/LayoutBase";

const InicioView = lazy(() => import('./views/InicioView'));
const HomeView = lazy(() => import('./views/HomeView'));

const CatalogView = lazy(() => import ('./views/users/CatalogView'));
const CrudExampleView = lazy(() => import('./modules/crudExample/CrudExampleView'));

function AppContent() {
    return (
        <Suspense fallback={<GifLoader showStatus={false}/>}>
            <Routes>
                <Route path="/" element={<LayoutAuth/>}>
                    <Route index element={<HomeView/>} />
                </Route>
                <Route element={<LayoutBase/>}>
                    <Route path="inicio" element={<InicioView />}/>
                    <Route path="informacion" element={<CatalogView />}/>
                    <Route path="ejemplo-crud" element={<CrudExampleView />}/>
                </Route>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </Suspense>
    );
}

function App() {
    const {notification} = AntdApp.useApp();

    return (
        <NotificationContext.Provider value={notification}>
            <AppContent />
        </NotificationContext.Provider>
    );
}

export default App;
