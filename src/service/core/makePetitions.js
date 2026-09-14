import apiService from "@/service/core/apiService";

export const get = async (url, params, options) => {
    const response = await apiService.get(url, {
        params,
        ...options,
    });

    return response.data;
}

export const post = async (url, body, options) => {
    const response = await apiService.post(url, body, options);

    return response.data;
}

export const put = async (url, body, options) => {
    const response = await apiService.put(url, body, options);

    return response.data;
};

export const del = async (url, body, options) => {
    const response = await apiService.delete(url, {
        data: body,
        ...options,
    });

    return response.data;
}

export const patch = async (url, body, options) => {
    const response = await apiService.patch(url, body, options);

    return response.data;
}
