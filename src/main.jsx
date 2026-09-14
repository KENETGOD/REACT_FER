import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import esES from "antd/locale/es_ES";
import GifLoader from "@/components/GifLoader";
import App from "@/App";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, 
            retry: 1,                  
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0, 
        },
    },
});

const theme = {
    token: {
        guinda: "#4D0621",
        purple: "#6A0F49",
        pink: "#FFC3D0",
        gray: "#f5f6f7",
        colorSuccess: "#10B981",
        colorWarning: "#F59E0B",
        colorError: "#EF4444",
    },
    components: {
        Layout: {
            triggerBg: "#4D0621",
        },
        Menu: {
            subMenuItemSelectedColor: "#4D0621",
            itemSelectedBg: "#4D0621",
            itemSelectedColor: "#fff",
        },
        Table: {
            headerBg: "#4D0621",
            headerColor: "#FFFFFF",
        },
    },
};

const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
        <FrownOutlined style={{ fontSize: 20 }} />
        <p>No se encontró información</p>
    </div>
);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ConfigProvider locale={esES} renderEmpty={customizeRenderEmpty || {}} theme={theme || {}}>
                    <AntdApp>
                        <GifLoader/>
                        <App/>
                    </AntdApp>
                </ConfigProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);