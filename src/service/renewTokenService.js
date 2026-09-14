import axios from "axios";
import { notification } from "antd";
import { useLoaderStore } from "@/store";

export const renewToken = async () => {
    const url = '/refresh';
    const { showLoader, hideLoader } = useLoaderStore.getState();

    const currentToken = localStorage.getItem("token");
    
    if (!currentToken) {
        return;
    }

    showLoader();

    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}${url}`, {
            headers: {
                Authorization: `Bearer ${currentToken}`,
            },
        });
        const { data: { token, usuario} } = res ?? {};
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(usuario));

        return globalThis.location.reload();
    } catch (error) {
        const { data } = error.response ?? {};
        const errorMessage = data?.message || "Error al renovar el token";

        notification.destroy();
        notification.error({
            message: "Error",
            description: errorMessage,
            duration: 3,
            placement: "bottomRight",
        });

        hideLoader();
        clearAuthDataAndRedirect();
    }
};

function clearAuthDataAndRedirect() {
    localStorage.clear();
    globalThis.location.href = "/";
}
