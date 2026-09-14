import apiService from "@/service/core/apiService";

const STORAGE_KEY = "tanstack-crud-example";

const initialRecords = [
    {
        id: 1,
        nombre: "Mariana Lopez",
        correo: "mariana.lopez@ejemplo.com",
        estatus: "activo",
    },
    {
        id: 2,
        nombre: "Carlos Vega",
        correo: "carlos.vega@ejemplo.com",
        estatus: "inactivo",
    },
];

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const readRecords = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRecords));
        return initialRecords;
    }

    try {
        return JSON.parse(raw);
    } catch {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRecords));
        return initialRecords;
    }
};

const writeRecords = (records) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const parseBody = (data) => {
    if (!data) return {};
    if (typeof data === "string") return JSON.parse(data);
    return data;
};

const createResponse = (config, data, status = 200) => ({
    data,
    status,
    statusText: "OK",
    headers: {},
    config,
    request: {},
});

const crudExampleAdapter = async (config) => {
    await delay();

    const method = config.method?.toLowerCase();
    const id = Number(config.url?.split("/").filter(Boolean).at(-1));
    const records = readRecords();

    if (method === "get") {
        return createResponse(config, { data: records, total: records.length });
    }

    if (method === "post") {
        const body = parseBody(config.data);
        const newRecord = {
            id: Date.now(),
            estatus: "activo",
            ...body,
        };
        const nextRecords = [newRecord, ...records];
        writeRecords(nextRecords);
        return createResponse(config, { data: newRecord });
    }

    if (method === "put") {
        const body = parseBody(config.data);
        const nextRecords = records.map((record) =>
            record.id === id ? { ...record, ...body } : record,
        );
        const updatedRecord = nextRecords.find((record) => record.id === id);
        writeRecords(nextRecords);
        return createResponse(config, { data: updatedRecord });
    }

    if (method === "delete") {
        const nextRecords = records.filter((record) => record.id !== id);
        writeRecords(nextRecords);
        return createResponse(config, { success: true });
    }

    return createResponse(config, { message: "Metodo no soportado" }, 405);
};

const request = async (config) => {
    const response = await apiService.request({
        ...config,
        adapter: crudExampleAdapter,
    });

    return response.data;
};

export const crudExampleApi = {
    list: () => request({ method: "get", url: "/example/users" }),
    create: (payload) => request({ method: "post", url: "/example/users", data: payload }),
    update: (id, payload) => request({ method: "put", url: `/example/users/${id}`, data: payload }),
    remove: (id) => request({ method: "delete", url: `/example/users/${id}` }),
};
