import axios, { AxiosHeaders} from 'axios';
import { showTokenModal, showInvalidToken } from '@/utils';
import { renewToken } from '@/service/renewTokenService';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 100000,
});

axiosInstance.interceptors.request.use((config) => {
    config.headers = AxiosHeaders.from(config.headers || {});

    const headers = config.headers;
    if (!headers.get("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const token = localStorage.getItem("token");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        if (headers.get("Content-Type") === "application/json") {
            headers.delete("Content-Type");
        }
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const statusDictionary = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error',
        }

        const messageDictionary = new Set([
            "Token inválido",
            "Token de autorización no encontrado",
            "Token inválido o expirado",
        ]);

        const {status, data} = error.response || {};
        if (status && statusDictionary[status] === 'Unauthorized' && !messageDictionary.has(data.message)) {
            showTokenModal(async () => {
                await renewToken();
            });
        }

        if (messageDictionary.has(data?.message)) {
            if (localStorage.getItem("token")) {
                showInvalidToken(data.message);
            }
        }

        return Promise.reject(error);
    },
);


export default axiosInstance;
